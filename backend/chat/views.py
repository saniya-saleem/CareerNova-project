from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Room
from .serializers import RoomSerializer

class CreateRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = Room.generate_code()
        room = Room.objects.create(
            code=code,
            created_by=request.user
        )
        room.participants.add(request.user)
        return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)


class JoinRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, code):
        try:
            room = Room.objects.get(code=code.upper(), is_active=True)
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found or inactive."},
                status=status.HTTP_404_NOT_FOUND
            )

        room.participants.add(request.user)
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)


class RoomDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, code):
        try:
            room = Room.objects.get(code=code.upper(), is_active=True)
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        
        if request.user not in room.participants.all():
            return Response(
                {"error": "You are not a participant in this room."},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(RoomSerializer(room).data)


class CloseRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, code):
        try:
            room = Room.objects.get(code=code.upper())
        except Room.DoesNotExist:
            return Response({"error": "Room not found."}, status=404)

        # Allow room creator OR admin to close
        is_admin = getattr(request.user, "role", "") == "admin" or request.user.is_staff
        if room.created_by != request.user and not is_admin:
            return Response({"error": "Not authorized."}, status=403)

        room.is_active = False
        room.save()
        return Response({"message": "Room closed."})
    
    
from rest_framework.permissions import IsAdminUser

class RoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rooms = Room.objects.all().order_by("-created_at")
        return Response(RoomSerializer(rooms, many=True).data)
    
    
    
    

    