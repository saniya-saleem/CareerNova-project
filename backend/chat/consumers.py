
import json
import os
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from groq import Groq



class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.user   = self.scope["user"]

        # Load existing history from DB
        self.history = await self.load_history()
        print(" ChatConsumer CONNECTED")
        await self.accept()

        # Send history to frontend on connect
        if self.history:
            await self.send(text_data=json.dumps({
                "type":     "history",
                "messages": self.history
            }))

    async def receive(self, text_data):
        try:
            data    = json.loads(text_data)
            message = data.get("message")

            # Save user message to DB
            await self.save_ai_message("user", message)
            self.history.append({"role": "user", "content": message})

            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a professional AI interviewer. Ask follow-up questions and evaluate answers concisely."},
                    *self.history
                ]
            )

            ai_reply = response.choices[0].message.content

            await self.save_ai_message("assistant", ai_reply)
            self.history.append({"role": "assistant", "content": ai_reply})

            await self.send(text_data=json.dumps({"ai": ai_reply}))

        except Exception as e:
            print(" ERROR:", str(e))
            await self.send(text_data=json.dumps({"error": str(e)}))

    @database_sync_to_async
    def load_history(self):
        from .models import AIMessage
        if not self.user.is_authenticated:
            return []
        msgs = AIMessage.objects.filter(user=self.user).order_by("created_at")
        return [{"role": m.role, "content": m.content} for m in msgs]

    @database_sync_to_async
    def save_ai_message(self, role, content):
        from .models import AIMessage
        if not self.user.is_authenticated:
            return
        AIMessage.objects.create(user=self.user, role=role, content=content)



class CallConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_code  = self.scope["url_route"]["kwargs"]["room_code"]
        self.room_group = f"call_{self.room_code}"
        self.user       = self.scope["user"]

        await self.channel_layer.group_add(self.room_group, self.channel_name)
        await self.accept()
        print(f"✅ CallConsumer CONNECTED — room: {self.room_code}")

        
        history = await self.load_room_history()
        if history:
            await self.send(text_data=json.dumps({
                "type":     "history",
                "messages": history
            }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group, self.channel_name)
        await self.channel_layer.group_send(self.room_group, {
            "type":   "call_signal",
            "data":   {"type": "peer-left"},
            "sender": self.channel_name
        })
        print(f" CallConsumer DISCONNECTED — room: {self.room_code}")

    async def receive(self, text_data):
        try:
            data        = json.loads(text_data)
            signal_type = data.get("type")
            print(f"📡 Signal received: {signal_type} in room {self.room_code}")

            if signal_type == "chat":
                
                content = data.get("content", "")
                await self.save_room_message(content)
                await self.channel_layer.group_send(self.room_group, {
                    "type": "call_signal",
                    "data": {
                        "type":      "chat",
                        "content":   content,
                        "sender":    self.user.username if self.user.is_authenticated else "Guest",
                        "timestamp": data.get("timestamp", ""),
                    },
                    "sender": None  
                })
            else:
                
                await self.channel_layer.group_send(self.room_group, {
                    "type":   "call_signal",
                    "data":   data,
                    "sender": self.channel_name
                })

        except Exception as e:
            print(f" CallConsumer ERROR: {e}")
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def call_signal(self, event):
      
        if event.get("sender") is None or event.get("sender") != self.channel_name:
            await self.send(text_data=json.dumps(event["data"]))

    @database_sync_to_async
    def load_room_history(self):
        from .models import Room, RoomMessage
        try:
            room = Room.objects.get(code=self.room_code)
            msgs = RoomMessage.objects.filter(room=room).order_by("created_at")
            return [
                {
                    "sender":    m.sender.username,
                    "content":   m.content,
                    "timestamp": m.created_at.isoformat(),
                }
                for m in msgs
            ]
        except Room.DoesNotExist:
            return []

    @database_sync_to_async
    def save_room_message(self, content):
        from .models import Room, RoomMessage
        if not self.user.is_authenticated or not content.strip():
            return
        try:
            room = Room.objects.get(code=self.room_code)
            RoomMessage.objects.create(room=room, sender=self.user, content=content)
        except Room.DoesNotExist:
            pass




class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return
        self.group_name = f"user_{self.user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f" NotificationConsumer connected: {self.user.username}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass

    async def incoming_call(self, event):
        await self.send(text_data=json.dumps({
            "type":      "incoming_call",
            "room_code": event["room_code"],
            "caller":    event["caller"],
        }))