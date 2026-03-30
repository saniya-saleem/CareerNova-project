import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function MockInterview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [recordingIndex, setRecordingIndex] = useState(null);

  // 🚀 START INTERVIEW
  const startInterview = async () => {
    if (!role) {
      toast.error("Select a role");
      return;
    }

    setLoading(true);
    setQuestions([]);
    setAnswers({});

    try {
      const res = await axios.post(
        "http://localhost:8000/api/interview/generate/",
        { role },
        { withCredentials: true }
      );

      setQuestions(res.data.questions || []);
      toast.success("Questions ready!");
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // ✍️ TEXT INPUT
  const handleAnswerChange = (i, val) => {
    setAnswers((prev) => ({ ...prev, [i]: val }));
  };

// const startRecording = async (index) => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//     const mediaRecorder = new MediaRecorder(stream);
//     const chunks = [];

//     setRecordingIndex(index);

//     mediaRecorder.ondataavailable = (e) => {
//       chunks.push(e.data);
//     };

//     mediaRecorder.start();

//     // ⏱️ RECORD 6 SECONDS
//     setTimeout(() => {
//       mediaRecorder.stop();
//     }, 6000);

//     mediaRecorder.onstop = async () => {
//       const blob = new Blob(chunks, { type: "audio/webm" });

//       const formData = new FormData();
//       formData.append("audio", blob, "voice.webm");

//       try {
//         const res = await axios.post(
//           "http://localhost:8000/api/interview/speech-to-text/",
//           formData,
//           { withCredentials: true }
//         );

//         let text = res.data.text;

//         // 🔥 CLEAN TEXT (IMPORTANT)
//         text = text.replace(/\b(\w+)( \1\b)+/g, "$1"); // remove repeats
//         text = text.replace(/\b(uh|um|ah)\b/gi, "");   // remove fillers
//         text = text.trim();

//         if (!text || text.length < 3) {
//           toast.error("Speak clearly");
//           return;
//         }

//         setAnswers((prev) => ({
//           ...prev,
//           [index]: (prev[index] || "") + " " + text,
//         }));

//       } catch (err) {
//         console.error(err);
//         toast.error("Speech recognition failed");
//       }

//       setRecordingIndex(null);
//     };

//   } catch (err) {
//     toast.error("Mic permission denied");
//   }
// };


// const startRecording = async (index) => {
//   try {
//     // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//     const stream = await navigator.mediaDevices.getUserMedia({ 
//   audio: {
//     echoCancellation: true,
//     noiseSuppression: true,
//     sampleRate: 44100,
//     channelCount: 1,
//   } 
// });
//     // const mediaRecorder = new MediaRecorder(stream);
//     const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
//   ? "audio/webm;codecs=opus"
//   : "audio/ogg;codecs=opus";

//     const mediaRecorder = new MediaRecorder(stream, { mimeType });
//     console.log("MIME TYPE:", mediaRecorder.mimeType);
//     const chunks = [];

//     setRecordingIndex(index);

//     mediaRecorder.ondataavailable = (e) => {
//       chunks.push(e.data);
//     };

//     mediaRecorder.start();

//     setTimeout(() => {
//       mediaRecorder.stop();
//     }, 10000);

//     mediaRecorder.onstop = async () => {
//       const blob = new Blob(chunks, { type: "audio/webm" });
//       console.log("BLOB SIZE:", blob.size);

//       // ✅ FIX 1: Block silent/empty audio before sending
//       if (blob.size < 500) {
//         toast.error("No speech detected, try again");
//         setRecordingIndex(null);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("audio", blob, "voice.webm");

//       try {
//         const res = await axios.post(
//           "http://localhost:8000/api/interview/speech-to-text/",
//           formData,
//           { withCredentials: true }
//         );

//         let text = res.data.text?.trim();
//         console.log("WHISPER RESULT:", JSON.stringify(text));

//         // ✅ FIX 2: Block Whisper hallucinations
//         const hallucinations = [
//           "you", "thank you", "thank you.", "thanks", "bye",
//           "goodbye", "okay", "ok", ".", "", "you."
//         ];
//         if (!text || hallucinations.includes(text.toLowerCase())) {
//           toast.error("Couldn't detect speech, please try again");
//           setRecordingIndex(null);
//           return;
//         }

//         // ✅ FIX 3: Clean up filler words
//         text = text.replace(/\b(\w+)( \1\b)+/g, "$1");
//         text = text.replace(/\b(uh|um|ah)\b/gi, "").trim();

//         if (text.length < 3) {
//           toast.error("Speak clearly and louder");
//           setRecordingIndex(null);
//           return;
//         }

//         setAnswers((prev) => ({
//           ...prev,
//           [index]: (prev[index] || "") + " " + text,
//         }));

//       } catch (err) {
//         console.error(err);
//         toast.error("Speech recognition failed");
//       }

//       setRecordingIndex(null);
//     };

//   } catch (err) {
//     toast.error("Mic permission denied");
//   }
// };

const startRecording = (index) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    toast.error("Your browser doesn't support speech recognition");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  setRecordingIndex(index);

  recognition.start();

  recognition.onresult = (event) => {
    let text = event.results[0][0].transcript.trim();

    text = text.replace(/\b(uh|um|ah)\b/gi, "").trim();

    if (!text || text.length < 3) {
      toast.error("Speak clearly");
      setRecordingIndex(null);
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [index]: (prev[index] || "") + " " + text,
    }));

    setRecordingIndex(null);
  };

  recognition.onerror = (e) => {
    console.error("Speech error:", e.error);
    toast.error("Speech recognition failed: " + e.error);
    setRecordingIndex(null);
  };

  recognition.onend = () => {
    setRecordingIndex(null);
  };
};
  // 📤 SUBMIT
  const submitAnswers = async () => {
    const filled = Object.keys(answers).length;

    if (filled < questions.length) {
      toast.error("Answer all questions");
      return;
    }

    try {
      const formatted = questions.map((q, i) => ({
        question: q,
        answer: answers[i],
      }));

      const res = await axios.post(
        "http://localhost:8000/api/interview/evaluate/",
        { answers: formatted },
        { withCredentials: true }
      );

      toast.success(`Score: ${res.data.score}/100`);
      console.log(res.data);

    } catch {
      toast.error("Evaluation failed");
    }
  };

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
  ];

  const progress = Object.keys(answers).length;

  // 🎧 WAV ENCODER (IMPORTANT)
  function encodeWAV(samples, sampleRate) {
    let length = samples.reduce((acc, s) => acc + s.length, 0);
    let buffer = new ArrayBuffer(44 + length * 2);
    let view = new DataView(buffer);

    function writeStr(v, o, s) {
      for (let i = 0; i < s.length; i++) {
        v.setUint8(o + i, s.charCodeAt(i));
      }
    }

    writeStr(view, 0, "RIFF");
    view.setUint32(4, 36 + length * 2, true);
    writeStr(view, 8, "WAVE");
    writeStr(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(view, 36, "data");
    view.setUint32(40, length * 2, true);

    let offset = 44;

    samples.forEach((chunk) => {
      for (let i = 0; i < chunk.length; i++) {
        let s = Math.max(-1, Math.min(1, chunk[i]));
        view.setInt16(offset, s * 0x7fff, true);
        offset += 2;
      }
    });

    return new Blob([view], { type: "audio/wav" });
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold text-center mb-6">
            Mock Interview 
          </h1>

          {/* ROLE */}
          <div className="bg-white p-4 rounded shadow mb-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-1 rounded ${
                    role === r ? "bg-indigo-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={startInterview}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              {loading ? "Loading..." : "Start Interview"}
            </button>
          </div>

          {/* QUESTIONS */}
          {questions.map((q, i) => (
            <div key={i} className="bg-white p-4 rounded shadow mb-4">
              <p className="font-semibold mb-2">{i + 1}. {q}</p>

              <textarea
                value={answers[i] || ""}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Type or speak..."
              />

              <button
                onClick={() => startRecording(i)}
                className={`mt-2 px-3 py-1 rounded ${
                  recordingIndex === i ? "bg-red-500 text-white" : "bg-indigo-500 text-white"
                }`}
              >
                {recordingIndex === i ? "Recording..." : " Speak"}
              </button>
            </div>
          ))}

          {questions.length > 0 && (
            <button
              onClick={submitAnswers}
              className="w-full bg-green-600 text-white py-3 rounded"
            >
              Submit ({progress}/{questions.length})
            </button>
          )}
        </div>
      </div>
    </>
  );
}