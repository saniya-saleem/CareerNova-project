import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([...messages, { text: message, sender: "me" }]);
    setMessage("");
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl flex flex-col">

        
        <div className="bg-indigo-600 text-white p-4 rounded-t-xl">
          <h2 className="text-lg font-semibold">Real-time Chat</h2>
        </div>

        
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">
              No messages yet
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === "me"
                  ? "bg-indigo-500 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        
        <div className="border-t p-3 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}