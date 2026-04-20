import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Mic, MicOff, Send, PlayCircle, Briefcase, Activity, CheckCircle2 } from "lucide-react";

export default function MockInterview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [recordingIndex, setRecordingIndex] = useState(null);

  // 🚀 START INTERVIEW
  const startInterview = async () => {
    if (!role) {
      toast.error("Please select a role first");
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
      toast.success("Questions generated successfully!");
    } catch {
      toast.error("Failed to load questions. Please check your generic API quota.");
    } finally {
      setLoading(false);
    }
  };

  // ✍️ TEXT INPUT
  const handleAnswerChange = (i, val) => {
    setAnswers((prev) => ({ ...prev, [i]: val }));
  };

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
      toast.error("Please answer all questions before submitting");
      return;
    }

    try {
      const formatted = questions.map((q, i) => ({
        question: q,
        answer: answers[i],
      }));

      const res = await axios.post(
        "http://localhost:8000/api/interview/evaluate/",
        { role: role, answers: formatted },
        { withCredentials: true }
      );

      toast.success(`Score: ${res.data.score}/100 🚀`);
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
  const progressPercent = questions.length > 0 ? Math.round((progress / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Left Sidebar: Controls & Progress */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-base sticky top-24">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center border border-primary-100 dark:border-primary-500/20">
                  <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-[var(--text-main)]">Setup Session</h2>
                 <p className="text-sm text-[var(--text-muted)]">Configure your interview parameters</p>
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-[var(--text-main)] block">Select Target Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left ${
                      role === r 
                      ? "bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:border-primary-500/50 dark:text-primary-300 shadow-sm" 
                      : "bg-[var(--bg-surface)] border-[var(--border-main)] text-[var(--text-main)] hover:border-primary-300 dark:hover:border-primary-700"
                    }`}
                  >
                    <Briefcase className={`w-4 h-4 ${role === r ? 'text-primary-600 dark:text-primary-400' : 'text-[var(--text-muted)]'}`} />
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-main)]">
              <button
                onClick={startInterview}
                disabled={loading || !role}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                   <span className="flex items-center gap-2">
                     <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Generating...
                   </span>
                ) : (
                   <>
                     <PlayCircle className="w-5 h-5" />
                     Start AI Interview
                   </>
                )}
              </button>
            </div>

            {/* Progress indicator (only shows when questions exist) */}
            {questions.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[var(--border-main)]">
                 <div className="flex items-center justify-between text-sm font-semibold mb-2">
                   <span className="text-[var(--text-main)]">Progress</span>
                   <span className="text-primary-600 dark:text-primary-400">{progress}/{questions.length}</span>
                 </div>
                 <div className="w-full bg-[var(--bg-main)] rounded-full h-2.5 overflow-hidden border border-[var(--border-main)]">
                    <motion.div 
                      className="bg-primary-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content: Questions & Answers */}
        <div className="lg:col-span-8 space-y-6">
          
          {questions.length === 0 && !loading && (
             <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[var(--border-main)] rounded-3xl bg-[var(--bg-surface)]">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-main)] flex items-center justify-center mb-4">
                   <Activity className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Ready when you are</h3>
                <p className="text-[var(--text-muted)] max-w-sm">
                  Select a target role on the left and start the AI interview to generate your specialized questions.
                </p>
             </div>
          )}

          {loading && (
             <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="card-base animate-pulse">
                    <div className="h-5 bg-[var(--border-main)] rounded w-3/4 mb-4"></div>
                    <div className="h-24 bg-[var(--bg-main)] rounded-xl border border-[var(--border-main)] w-full"></div>
                 </div>
               ))}
             </div>
          )}

          {!loading && questions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="space-y-6"
            >
              {questions.map((q, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className="card-base group"
                >
                  <div className="flex items-start gap-4 mb-4">
                     <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-bold text-sm">
                       {i + 1}
                     </span>
                     <p className="font-semibold text-lg text-[var(--text-main)] mt-0.5 leading-snug">{q}</p>
                  </div>

                  <div className="relative">
                    <textarea
                      value={answers[i] || ""}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      className="input-base min-h-[120px] resize-y py-4"
                      placeholder="Type your answer, or use the microphone to speak natively..."
                    />
                    
                    {/* Voice Recording Badge Status */}
                    {recordingIndex === i && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Recording
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end mt-4">
                    <button
                      onClick={() => startRecording(i)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        recordingIndex === i 
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 active:scale-95" 
                        : "bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95"
                      }`}
                    >
                      {recordingIndex === i ? (
                         <>
                           <MicOff className="w-4 h-4" /> Stop
                         </>
                      ) : (
                         <>
                           <Mic className="w-4 h-4 text-primary-500" /> Speak
                         </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6"
              >
                <button
                  onClick={submitAnswers}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white rounded-2xl font-bold text-lg shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                  disabled={progress < questions.length}
                >
                  <Send className="w-5 h-5" />
                  Submit Interview ({progress}/{questions.length})
                </button>
                {progress < questions.length && (
                  <p className="text-center text-sm text-[var(--text-muted)] mt-3">
                    Please provide an answer for all questions before submitting.
                  </p>
                )}
              </motion.div>

            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
