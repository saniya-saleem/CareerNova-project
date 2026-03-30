import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8001/ws/chat/");
    setSocket(ws);

    ws.onopen = () => {
      console.log(" WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTyping(false);

      if (data.ai) {
        setMessages((prev) => [...prev, { text: data.ai, sender: "ai" }]);
      }

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { text: "Error: " + data.error, sender: "ai" },
        ]);
      }
    };

    ws.onclose = () => {
      console.log(" WebSocket disconnected");
      setConnected(false);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !connected) return;

    setMessages((prev) => [...prev, { text: message, sender: "me" }]);
    setTyping(true);

    socket.send(JSON.stringify({ message }));
    setMessage("");
  };
return (
  <div className="min-h-screen bg-gray-100">
    
    {/* ✅ Navbar */}
    <Navbar />

 
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl flex flex-col h-[85vh]">

        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">AI Interviewer</h2>
            <p className="text-sm opacity-80">Ask me anything</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              connected
                ? "bg-green-400 text-white"
                : "bg-red-400 text-white"
            }`}
          >
            {connected ? "Live" : "Disconnected"}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              Start your interview...
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-sm text-sm ${
                  msg.sender === "me"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.sender === "ai" && (
                  <p className="text-xs text-gray-500 mb-1 font-semibold">
                    AI Interviewer
                  </p>
                )}
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-gray-200 px-4 py-2 rounded-2xl text-sm text-gray-500">
                AI is typing...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={connected ? "Type your answer..." : "Connecting..."}
            disabled={!connected}
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!connected}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  </div>
);
}