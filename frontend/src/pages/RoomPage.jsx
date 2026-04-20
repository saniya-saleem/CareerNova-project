import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import RoomChatPanel from "../components/RoomChatPanel";
import { clearAuthSession, fetchCurrentUser, getAuthHeaders } from "../utils/auth";

const SESSION_STORAGE_KEY = "activePracticeSessionId";

export default function RoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const WS_BASE =
  window.location.protocol === "https:"
    ? "wss://localhost:8000"
    : "ws://localhost:8000";

  const initialRoomCode = location.state?.roomCode || null;
  const storedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);

  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [sessionId, setSessionId] = useState(storedSessionId);
  const [status, setStatus] = useState(initialRoomCode ? "connected" : storedSessionId ? "pending" : "idle");
  const [layoutSize, setLayoutSize] = useState("default");
  const [chatVisible, setChatVisible] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(location.state?.userRole || "candidate");
  const [userResolved, setUserResolved] = useState(Boolean(location.state?.userRole) || !initialRoomCode);
  const isAdmin = currentUserRole === "admin";

  const handleUnauthorized = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    clearAuthSession();
    setSessionId(null);
    setRoomCode(null);
    setStatus("idle");
    navigate("/login");
  };

  const syncSessionState = (data) => {
    const nextSessionId = data?.session_id ? String(data.session_id) : null;
    const nextStatus = data?.status || "idle";
    const nextRoomCode = data?.room_code || null;

    setSessionId(nextSessionId);
    setRoomCode(nextRoomCode);
    setStatus(nextRoomCode ? "connected" : nextStatus);

    if (nextSessionId && nextStatus !== "rejected") {
      sessionStorage.setItem(SESSION_STORAGE_KEY, nextSessionId);
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => {
        if (user?.role) {
          setCurrentUserRole(user.role);
        }
        setUserResolved(true);
      })
      .catch(() => setUserResolved(true));
  }, []);

  const fetchCurrentSession = async () => {
    const res = await fetch("http://localhost:8000/api/session/current/", {
      headers: getAuthHeaders(),
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();
    if (res.status === 401) {
      handleUnauthorized();
      throw data;
    }
    if (!res.ok) throw data;

    syncSessionState(data);
    return data;
  };

  useEffect(() => {
    if (initialRoomCode) return;

    const restoreSession = async () => {
      try {
        await fetchCurrentSession();
      } catch (err) {
        console.error("Restore Session Error:", err);
      }
    };

    restoreSession();
  }, [initialRoomCode]);


  const startPractice = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/session/request/",
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include", 
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        throw data;
      }
      if (!res.ok) throw data;

      syncSessionState(data);
    } catch (err) {
      console.error("Start Practice Error:", err);
    }
  };

  
  useEffect(() => {
    if (initialRoomCode || roomCode) return;

    const interval = setInterval(async () => {
      try {
        const data = await fetchCurrentSession();

        if (data.status === "accepted") {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        } else if (data.status === "rejected" || data.status === "idle") {
          setStatus("idle");
          setRoomCode(null);
          setSessionId(null);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (err) {
        console.error("Polling Error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [initialRoomCode, roomCode]);

  // 🔹 STEP 1: Start button
  if (status === "idle") {
    return (
      <div className="min-h-screen bg-[#060816] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.14),_transparent_24%)]" />
        <div className="relative h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/6 backdrop-blur-xl panel-glow overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-10 sm:p-12">
                <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Practice Session
                </div>
                <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Start a mentor-style interview room in one click.
                </h1>
                <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
                  Create a live room, wait for the admin mentor to accept, and continue the conversation with video and chat in the same focused workspace.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
                  <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Live admin-user call</span>
                  <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Shared room chat</span>
                  <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Rejoin-friendly flow</span>
                </div>
                <button
                  onClick={startPractice}
                  className="btn-primary mt-10 px-8 py-4 text-base rounded-2xl"
                >
                  Start Practice
                </button>
              </div>
              <div className="border-l border-white/8 bg-black/10 p-8 sm:p-10 flex flex-col justify-center">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-6">
                  <p className="text-sm font-semibold text-white">How it works</p>
                  <div className="mt-6 space-y-5">
                    {[
                      ["1", "You create the request"],
                      ["2", "Admin accepts the session"],
                      ["3", "Both join the same live room"],
                    ].map(([step, label]) => (
                      <div key={step} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                          {step}
                        </div>
                        <p className="text-sm text-slate-300">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 STEP 2: Waiting screen
  if (status === "pending" && !roomCode) {
    return (
      <div className="min-h-screen bg-[#060816] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.14),_transparent_20%)]" />
        <div className="relative h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/6 p-10 text-center backdrop-blur-xl panel-glow">
            <div className="mx-auto h-16 w-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-2xl">
              <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">Waiting for admin approval</h2>
            <p className="mt-3 text-slate-300 leading-relaxed">
              Your session request has been sent. As soon as the admin mentor accepts it, this page will move you into the live room automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 STEP 3: VIDEO CALL
  return (
    <div className="h-screen bg-[#050816] flex flex-col overflow-hidden">

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.1),_transparent_22%)]" />

      {/* Top Bar */}
      <div className="relative flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex h-12 w-12 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-indigo-500/20 to-cyan-500/15 items-center justify-center shadow-[0_10px_30px_rgba(6,182,212,0.12)]">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 font-semibold">
            Live Mentor Room
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-violet-300 font-mono tracking-[0.18em]">
                {roomCode}
              </span>
              <span className="hidden md:inline-flex items-center rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-300">
                Mentor Online
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayoutSize((current) => current === "wide" ? "default" : "wide")}
            className={`text-xs rounded-2xl px-4 py-2.5 transition-colors border ${
              layoutSize === "wide"
                ? "bg-cyan-500/12 border-cyan-400/25 text-cyan-200"
                : "text-slate-200 border-slate-700 hover:bg-slate-800/80 bg-slate-900/40"
            }`}
          >
            {layoutSize === "wide" ? "Decrease Screen" : "Increase Screen"}
          </button>
          <button
            onClick={() => setChatVisible((current) => !current)}
            className={`text-xs rounded-2xl px-4 py-2.5 transition-colors border ${
              chatVisible
                ? "text-slate-200 border-slate-700 hover:bg-slate-800/80 bg-slate-900/40"
                : "bg-violet-500/12 border-violet-400/25 text-violet-200"
            }`}
          >
            {chatVisible ? "Hide Chat" : "Show Chat"}
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem(SESSION_STORAGE_KEY);
              navigate(isAdmin ? "/admin-panel" : "/dashboard");
            }}
            className="text-xs text-slate-200 border border-slate-700 rounded-2xl px-4 py-2.5 hover:bg-slate-800/80 transition-colors bg-slate-900/40"
          >
            Leave
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">

        {/* Video */}
        <div
          className={`flex items-center justify-center px-4 py-4 lg:px-6 lg:py-6 transition-all duration-300 ${
            chatVisible
              ? layoutSize === "wide"
                ? "flex-[1.55]"
                : "flex-1"
              : "flex-1"
          }`}
        >
          {userResolved ? (
          <VideoCall
            roomCode={roomCode}
            wsBaseUrl={WS_BASE}
            autoStart
            localLabel={isAdmin ? "Admin" : "User"}
            remoteLabel={isAdmin ? "User" : "Admin"}
            isInitiator={isAdmin} // admin starts call
            layoutSize={layoutSize}
          />
          ) : (
            <div className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-white/6 p-10 text-center text-slate-300 backdrop-blur-xl">
              Preparing room...
            </div>
          )}
        </div>

        {/* Chat */}
        {chatVisible && (
          <div
            className={`border-l border-slate-800/80 bg-[linear-gradient(180deg,rgba(2,6,23,0.68),rgba(15,23,42,0.88))] backdrop-blur-xl transition-all duration-300 ${
              layoutSize === "wide" ? "w-[20rem]" : "w-[25rem]"
            } max-w-full`}
          >
            <RoomChatPanel roomCode={roomCode} wsBaseUrl="ws://localhost:8000" />
          </div>
        )}

      </div>
    </div>
  );
}
