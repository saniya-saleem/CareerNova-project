import { useEffect, useRef, useState } from "react";
import { Send, MessageSquare } from "lucide-react";

export default function RoomChatPanel({ roomCode, wsBaseUrl = "ws://localhost:8000" }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!roomCode) return;

    const socket = new WebSocket(`${wsBaseUrl}/ws/call/${roomCode}/`);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "chat-join" }));
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "history" && Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((item, index) => ({
              id: `history-${index}`,
              sender: item.sender || "System",
              content: item.content || "",
            }))
          );
          return;
        }

        if (data.type === "chat") {
          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              sender: data.sender || "Guest",
              content: data.content || "",
            },
          ]);
        }
      } catch (error) {
        console.error("Room chat parse error:", error);
      }
    };

    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [roomCode, wsBaseUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = message.trim();
    if (!text || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "chat",
        content: text,
        timestamp: new Date().toISOString(),
      })
    );
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <aside className="w-full h-full max-w-sm text-slate-100 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-violet-500/18 to-cyan-500/14 border border-violet-400/20 flex items-center justify-center shadow-[0_12px_30px_rgba(79,70,229,0.16)]">
            <MessageSquare className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">Room Chat</p>
            <p className="text-xs text-slate-400">
              {connected ? "Connected" : "Connecting..."}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono tracking-widest text-slate-500">
          {roomCode}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-sm text-slate-500 px-6">
            Start the conversation here while the mentor call is live.
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.35rem] bg-slate-900/88 border border-slate-800 px-4 py-3.5 shadow-[0_14px_30px_rgba(2,6,23,0.18)]"
            >
              <p className="text-[11px] uppercase tracking-wide text-violet-400 mb-1">
                {item.sender}
              </p>
              <p className="text-sm text-slate-200 whitespace-pre-wrap">
                {item.content}
              </p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
        <div className="flex items-end gap-2 rounded-[1.6rem] bg-slate-950/95 border border-slate-800 px-3 py-3 shadow-[0_18px_40px_rgba(2,6,23,0.22)]">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={connected ? "Type a message..." : "Connecting to room chat..."}
            disabled={!connected}
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm text-slate-100 placeholder:text-slate-500"
          />
          <button
            onClick={sendMessage}
            disabled={!connected || !message.trim()}
            className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-violet-600 to-cyan-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_12px_24px_rgba(79,70,229,0.28)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
