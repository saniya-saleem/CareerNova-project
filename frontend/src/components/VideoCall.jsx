import { useState, useEffect, useRef, useCallback } from "react";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};


const MicIcon = ({ muted }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {muted ? (
      <>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </>
    ) : (
      <>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </>
    )}
  </svg>
);

const CamIcon = ({ off }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <>
        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
        <path d="M23 7l-7 5 7 5V7z" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    )}
  </svg>
);

const PhoneOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.42 19.42 0 0 1 4.43 9.88a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.3 8.91" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);


const STATUS_LABEL = {
  idle:       "Ready to call",
  connecting: "Connecting…",
  connected:  "Connected",
  ended:      "Call ended",
};

const STATUS_DOT = {
  idle:       "bg-slate-500",
  connecting: "bg-amber-400 animate-pulse",
  connected:  "bg-green-500",
  ended:      "bg-red-500",
};


export default function VideoCall({
  roomCode,
  wsBaseUrl = "ws://localhost:8000",
  autoStart = true,
  localLabel = "You",
  remoteLabel = "Remote",
  isInitiator = false,
  layoutSize = "default",
}) {
  const localVideoRef  = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef          = useRef(null);
  const wsRef          = useRef(null);
  const localStreamRef = useRef(null);
  const peerId         = useRef(Math.random().toString(36).substring(7)).current;
  const hasNegotiated  = useRef(false);
  const statusRef      = useRef("idle");
  const hasStartedRef  = useRef(false);
  const pendingIceRef  = useRef([]);

  const [status,      setStatus]      = useState("idle");
  const [micMuted,    setMicMuted]    = useState(false);
  const [camOff,      setCamOff]      = useState(false);
  const [audioOnly,   setAudioOnly]   = useState(false);
  const [peerLeft,    setPeerLeft]    = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);

  const isActive = status === "connecting" || status === "connected";
  const isEnded  = status === "ended";

  useEffect(() => {
    statusRef.current = status;
  }, [status]);


  const cleanup = useCallback(() => {
    pcRef.current?.close();
    wsRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current  = null;
    wsRef.current  = null;
    localStreamRef.current = null;
    hasNegotiated.current = false;
    hasStartedRef.current = false;
    pendingIceRef.current = [];
    if (localVideoRef.current)  localVideoRef.current.srcObject  = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  }, []);

  const flushPendingIceCandidates = useCallback(async (pc) => {
    if (!pc?.remoteDescription) return;

    while (pendingIceRef.current.length) {
      const candidate = pendingIceRef.current.shift();
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  const createPC = useCallback((stream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
        setRemoteReady(true);
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ice-candidate", candidate: e.candidate }));
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected")    setStatus("connected");
      if (pc.connectionState === "disconnected") setStatus("ended");
      if (pc.connectionState === "failed")       setStatus("ended");
    };

    return pc;
  }, []);

const createAndSendOffer = useCallback(async () => {
  const pc = pcRef.current;
  const ws = wsRef.current;

  if (
    !pc ||
    !ws ||
    ws.readyState !== WebSocket.OPEN ||
    hasNegotiated.current ||
    pc.signalingState !== "stable"
  ) {
    return;
  }

  console.log("CREATING OFFER");

  hasNegotiated.current = true;

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  ws.send(JSON.stringify({
    type: "offer",
    sdp: pc.localDescription,
  }));

}, []);

  const resetPeerConnection = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.close();
    }

    pendingIceRef.current = [];
    hasNegotiated.current = false;
    pcRef.current = createPC(stream);
  }, [createPC]);


const handleSignal = useCallback(async (data) => {
  const pc = pcRef.current;
  const ws = wsRef.current;

  if (!pc || !ws) return;

  try {
    // 🔹 OFFER
    if (data.type === "offer") {
      console.log("RECEIVED OFFER");

      hasNegotiated.current = true;

      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      await flushPendingIceCandidates(pc);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      ws.send(JSON.stringify({
        type: "answer",
        sdp: pc.localDescription,
      }));
    }

    // 🔹 ANSWER
    else if (data.type === "answer") {
      console.log("RECEIVED ANSWER");

      hasNegotiated.current = true;

      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      await flushPendingIceCandidates(pc);
    }

    // 🔹 ICE
    else if (data.type === "ice-candidate") {
      if (data.candidate) {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
          pendingIceRef.current.push(data.candidate);
        }
      }
    }

    // 🔥 JOIN
    else if (data.type === "join") {
      console.log("JOIN RECEIVED");

      ws.send(JSON.stringify({ type: "join-ack" }));

      if (isInitiator && !hasNegotiated.current && pc.signalingState === "stable") {
        await createAndSendOffer();
      }
    }

    // 🔥 JOIN ACK
    else if (data.type === "join-ack") {
      console.log("JOIN ACK");

      if (isInitiator && !hasNegotiated.current && pc.signalingState === "stable") {
        await createAndSendOffer();
      }
    }

    // 🔥 CREATE OFFER
    else if (data.type === "create-offer") {
      console.log("CREATE OFFER");

      if (isInitiator && !hasNegotiated.current && pc.signalingState === "stable") {
        await createAndSendOffer();
      }
    }

    // 🔹 PEER LEFT
    else if (data.type === "peer-left") {
      console.log("PEER LEFT");

      setPeerLeft(true);
      setRemoteReady(false);
      setStatus("connecting");

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      resetPeerConnection();
    }

  } catch (err) {
    console.error("Signaling Error:", err);
  }

}, [createAndSendOffer, flushPendingIceCandidates, resetPeerConnection, isInitiator]);


  const startCall = useCallback(async () => {
    if (!roomCode || hasStartedRef.current || pcRef.current || wsRef.current) return;

    hasStartedRef.current = true;
    setStatus("connecting");
    setPeerLeft(false);
    setRemoteReady(false);

    try {
      const constraints = audioOnly
        ? { audio: true, video: false }
        : { audio: true, video: { width: 1280, height: 720 } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = createPC(stream);
      pcRef.current = pc;

      const ws = new WebSocket(`${wsBaseUrl}/ws/call/${roomCode}/`);
      wsRef.current = ws;

      // ws.onopen = () => {
      //   hasNegotiated.current = false;
      //   ws.send(JSON.stringify({ type: "join", peerId }));
      // };
 ws.onopen = () => {
  console.log("WS CONNECTED");

  hasNegotiated.current = false;

  ws.send(JSON.stringify({ type: "join" }));
};

      // ws.onmessage = (e) => handleSignal(JSON.parse(e.data));
      ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log("WS SIGNAL:", data);
  handleSignal(data);
};
      ws.onerror   = ()  => setStatus("ended");
      ws.onclose   = ()  => {
        if (statusRef.current !== "ended") {
          setStatus("ended");
        }
        wsRef.current = null;
        hasStartedRef.current = false;
      };

    } catch (err) {
      console.error("Call error:", err);
      hasStartedRef.current = false;
      setStatus("idle");
    }
  }, [audioOnly, roomCode, wsBaseUrl, createPC, handleSignal]);

  const endCall = useCallback(() => {
    cleanup();
    setStatus("ended");
    setRemoteReady(false);
  }, [cleanup]);
  const toggleMic = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicMuted((v) => !v);
  }, []);

  
  const toggleCam = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOff((v) => !v);
  }, []);

  const toggleAudioOnly = useCallback(() => {
    if (isActive) return;
    setAudioOnly((v) => !v);
  }, [isActive]);

  const copyRoomCode = useCallback(() => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomCode]);

  useEffect(() => () => cleanup(), [cleanup]);

  useEffect(() => {
    cleanup();
    setStatus("idle");
    setPeerLeft(false);
    setRemoteReady(false);
    setMicMuted(false);
    setCamOff(false);
  }, [cleanup, roomCode]);

  useEffect(() => {
    if (!autoStart || !roomCode || status !== "idle") return;
    startCall();
  }, [autoStart, roomCode, startCall, status]);

  return (
    <div
      className={`flex flex-col gap-4 bg-gray-950 rounded-2xl p-5 w-full mx-auto text-slate-100 transition-all duration-300 ${
        layoutSize === "wide" ? "max-w-[92rem]" : "max-w-3xl"
      }`}
    >

      {/* ── Room code banner ── */}
      <div className="flex items-center gap-3 bg-gray-900 rounded-xl px-4 py-3 border border-gray-800">
        <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
          Room
        </span>
        <span className="font-mono text-base font-semibold text-violet-400 tracking-widest flex-1">
          {roomCode}
        </span>
        <button
          onClick={copyRoomCode}
          className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-slate-400 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <CopyIcon />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* ── Video grid ── */}
      <div className={`grid gap-3 ${audioOnly ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>

        {/* Remote */}
        <div className="relative bg-gray-900 rounded-xl overflow-hidden min-h-48 border border-gray-800 flex items-center justify-center">
          {!audioOnly && (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {!remoteReady && (
            <div className="flex flex-col items-center justify-center gap-2 z-10 p-4">
              {audioOnly ? (
                <div className="relative flex items-center justify-center w-20 h-20">
                  <div className="absolute w-20 h-20 rounded-full border-2 border-violet-500/30 animate-ping" />
                  <span className="text-4xl z-10">🎙</span>
                </div>
              ) : (
                <span className="text-slate-600 text-sm italic text-center">
                  {peerLeft ? "Peer disconnected" : isActive ? "Waiting for peer..." : "Remote feed"}
                </span>
              )}
            </div>
          )}
          <span className="absolute bottom-2 left-2 text-xs font-semibold text-slate-400 bg-black/50 px-2 py-0.5 rounded z-10">
            {remoteLabel}
          </span>
        </div>

        {/* Local */}
        <div className="relative bg-gray-900 rounded-xl overflow-hidden min-h-48 border border-gray-800 flex items-center justify-center">
          {!audioOnly && (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${camOff ? "opacity-0" : "opacity-100"}`}
            />
          )}
          {(camOff || audioOnly) && (
            <div className="flex items-center justify-center z-10">
              <span className="text-slate-600 text-sm italic">
                {audioOnly ? "Audio only" : "Camera off"}
              </span>
            </div>
          )}
          <span className="absolute bottom-2 left-2 text-xs font-semibold text-slate-400 bg-black/50 px-2 py-0.5 rounded z-10">
            {localLabel}
          </span>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
        <span className="text-xs text-slate-500">{STATUS_LABEL[status]}</span>
      </div>

      {/* ── Controls ── */}
      <div className="flex gap-2 flex-wrap">

        {/* Audio-only toggle */}
        <button
          onClick={toggleAudioOnly}
          disabled={isActive}
          title="Toggle audio-only mode"
          className={`flex flex-col items-center gap-1 flex-1 min-w-16 px-4 py-3 rounded-xl border text-xs font-medium transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
            ${audioOnly
              ? "bg-violet-900/40 border-violet-600 text-violet-400"
              : "bg-gray-900 border-gray-800 text-slate-400 hover:bg-gray-800"}`}
        >
          <HeadphonesIcon />
          <span>{audioOnly ? "Audio" : "Video"}</span>
        </button>

        {/* Mic toggle */}
        <button
          onClick={toggleMic}
          disabled={!isActive}
          title={micMuted ? "Unmute mic" : "Mute mic"}
          className={`flex flex-col items-center gap-1 flex-1 min-w-16 px-4 py-3 rounded-xl border text-xs font-medium transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
            ${micMuted
              ? "bg-red-900/40 border-red-700 text-red-400"
              : "bg-gray-900 border-gray-800 text-slate-400 hover:bg-gray-800"}`}
        >
          <MicIcon muted={micMuted} />
          <span>{micMuted ? "Unmute" : "Mute"}</span>
        </button>

        {/* Camera toggle */}
        {!audioOnly && (
          <button
            onClick={toggleCam}
            disabled={!isActive}
            title={camOff ? "Turn camera on" : "Turn camera off"}
            className={`flex flex-col items-center gap-1 flex-1 min-w-16 px-4 py-3 rounded-xl border text-xs font-medium transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
              ${camOff
                ? "bg-red-900/40 border-red-700 text-red-400"
                : "bg-gray-900 border-gray-800 text-slate-400 hover:bg-gray-800"}`}
          >
            <CamIcon off={camOff} />
            <span>{camOff ? "Cam on" : "Cam off"}</span>
          </button>
        )}

        {/* Start / End call */}
        {!isActive ? (
          <button
            onClick={startCall}
            className="flex flex-col items-center gap-1 flex-1 min-w-16 px-4 py-3 rounded-xl border
              bg-green-900/40 border-green-700 text-green-400 hover:bg-green-900/60
              text-xs font-medium transition-colors cursor-pointer"
          >
            <PhoneIcon />
            <span>{isEnded ? "Rejoin" : "Start Call"}</span>
          </button>
        ) : (
          <button
            onClick={endCall}
            className="flex flex-col items-center gap-1 flex-1 min-w-16 px-4 py-3 rounded-xl border
              bg-red-900/40 border-red-700 text-red-400 hover:bg-red-900/60
              text-xs font-medium transition-colors cursor-pointer"
          >
            <PhoneOffIcon />
            <span>End Call</span>
          </button>
        )}
      </div>
    </div>
  );
}
