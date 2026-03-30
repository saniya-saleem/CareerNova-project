import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import CallChat from "./Chat";

export default function RoomPage() {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState("idle");

  const username = "You";

  // 🔥 START PRACTICE (FIXED → fetch)
  const startPractice = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/session/request/",
        {
          method: "POST",
          credentials: "include", // ✅ VERY IMPORTANT
        }
      );

      const data = await res.json();

      if (!res.ok) throw data;

      setSessionId(data.session_id);
      setStatus("pending");
    } catch (err) {
      console.error("Start Practice Error:", err);
    }
  };

  // 🔥 POLL SESSION STATUS (FIXED → fetch)
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/session/status/${sessionId}/`,
          {
            credentials: "include", // ✅ IMPORTANT
          }
        );

        const data = await res.json();

        if (data.status === "accepted") {
          setRoomCode(data.room_code);
          setStatus("connected");
        }
      } catch (err) {
        console.error("Polling Error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId]);

  // 🔹 STEP 1: Start button
  if (status === "idle") {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <button
          onClick={startPractice}
          className="bg-violet-600 text-white px-6 py-3 rounded-xl"
        >
          Start Practice
        </button>
      </div>
    );
  }

  // 🔹 STEP 2: Waiting screen
  if (status === "pending" && !roomCode) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        Waiting for admin to accept...
      </div>
    );
  }

  // 🔹 STEP 3: VIDEO CALL
  return (
    <div className="h-screen bg-gray-950 flex flex-col">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <span className="text-sm text-violet-400 font-mono">
          Room: {roomCode}
        </span>

        <button
          onClick={() => navigate("/")}
          className="text-xs text-gray-400"
        >
          Leave
        </button>
      </div>

      <div className="flex flex-1">

        {/* Video */}
        <div className="flex-1 flex items-center justify-center">
          <VideoCall roomCode={roomCode} wsBaseUrl="ws://localhost:8000" />
        </div>

        {/* Chat */}
        <div className="w-80">
          <CallChat roomCode={roomCode} username={username} />
        </div>

      </div>
    </div>
  );
}