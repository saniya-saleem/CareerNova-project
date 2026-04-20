import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { Send, Bot, User, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Ideally this URL comes from an env variable
    const ws = new WebSocket("ws://localhost:8000/ws/chat/");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
      // Optional initial greeting message simulation if empty
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTyping(false);

        if (data.ai) {
          setMessages((prev) => [...prev, { text: data.ai, sender: "ai" }]);
        }

        if (data.error) {
          setMessages((prev) => [
            ...prev,
            { text: "Error: " + data.error, sender: "error" },
          ]);
        }
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-64px)]">
        
        {/* Chat Container */}
        <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl shadow-sm flex flex-col overflow-hidden relative">
          
          {/* Header */}
          <div className="h-16 border-b border-[var(--border-main)] bg-[var(--bg-surface)] flex items-center justify-between px-6 flex-shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--text-main)] leading-none mb-1">AI Interview Assistant</h2>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">{connected ? 'Online & Ready' : 'Connecting...'}</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-medium">
              <Info className="w-3.5 h-3.5" /> Responses are generated in real-time
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
            
            {messages.length === 0 && connected && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-6 border border-primary-100 dark:border-primary-500/20">
                  <Bot className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Start your interview</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  I am an AI assistant trained to conduct mock interviews. Introduce yourself and tell me what role you are interviewing for to get started.
                </p>
                
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                   {["I want to practice for a Frontend Developer role.", "Ask me behavioral questions.", "Let's do a system design interview."].map((suggestion, i) => (
                     <button 
                       key={i}
                       onClick={() => { setMessage(suggestion); }}
                       className="text-xs bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-primary-600 hover:border-primary-300 dark:hover:text-primary-400 dark:hover:border-primary-700 px-3 py-2 rounded-full transition-colors"
                     >
                       {suggestion}
                     </button>
                   ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
                const isMe = msg.sender === "me";
                const isError = msg.sender === "error";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 w-full ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex-shrink-0 flex items-center justify-center border border-primary-200 dark:border-primary-800">
                        {isError ? <Info className="w-4 h-4 text-rose-500" /> : <Bot className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                      </div>
                    )}

                    <div 
                      className={`relative px-5 py-3.5 max-w-[85%] sm:max-w-[75%] shadow-sm ${
                        isMe 
                        ? "bg-primary-600 text-white rounded-2xl rounded-tr-sm" 
                        : isError
                          ? "bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 rounded-2xl rounded-tl-sm"
                          : "bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] rounded-2xl rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                    </div>

                    {isMe && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center border border-slate-300 dark:border-slate-600 overflow-hidden">
                        <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </div>
                    )}

                  </motion.div>
                );
              })}

              {typing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="flex gap-4 w-full justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex-shrink-0 flex items-center justify-center border border-primary-200 dark:border-primary-800">
                    <Bot className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="px-5 py-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce"></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} className="h-1" />
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 pb-6 bg-[var(--bg-surface)] border-t border-[var(--border-main)] z-10">
            <div className="relative flex items-end gap-2 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all shadow-sm">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={connected ? "Type a message..." : "Connecting to server..."}
                disabled={!connected}
                rows={1}
                className="w-full bg-transparent px-5 py-4 outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] resize-none min-h-[56px] max-h-[200px] overflow-y-auto text-sm font-medium"
                style={{ height: "auto" }}
              />
              <div className="pr-3 pb-3 flex-shrink-0">
                <button
                  onClick={sendMessage}
                  disabled={!connected || !message.trim()}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary-500/20 active:scale-95"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
            <div className="text-center mt-3">
               <p className="text-[10px] text-[var(--text-muted)] font-medium tracking-wide">AI can make mistakes. Verify important information.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}