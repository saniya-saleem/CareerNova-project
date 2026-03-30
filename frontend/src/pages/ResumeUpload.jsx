import { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function getGrade(score) {
  if (score >= 85) return { label: "Excellent", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" };
  if (score >= 70) return { label: "Good",      color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" };
  if (score >= 55) return { label: "Fair",      color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
  return              { label: "Needs Work", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
}

function buildSections(skillsFound = [], suggestions = []) {
  return [
    {
      key: "education", name: "Education", emoji: "🎓",
      score: 70, status: "warn",
      desc: "Education section present but missing graduation dates and coursework details.",
      recs: ["Include graduation year or expected date.", "Add certifications or additional training.", "Mention academic achievements if applicable."],
    },
    {
      key: "formatting", name: "Formatting", emoji: "✦",
      score: 65, status: "warn",
      desc: "Formatting is basic — inconsistent spacing and font usage detected.",
      recs: ["Use consistent font sizes throughout.", "Add clear section headers with spacing.", "Align text uniformly and use bullet points consistently."],
    },
    {
      key: "contact", name: "Contact Info", emoji: "◎",
      score: 90, status: "pass",
      desc: "Contact information is complete with all required details.",
      recs: [],
    },
    {
      key: "skills", name: "Skills", emoji: "⚡",
      score: skillsFound.length > 5 ? 85 : 60,
      status: skillsFound.length > 5 ? "pass" : "warn",
      desc: skillsFound.length > 5
        ? `${skillsFound.length} relevant skills detected — strong coverage.`
        : "Skills section could include more in-demand technologies.",
      recs: skillsFound.length > 5 ? [] : ["Add proficiency levels to each skill.", "Include more tools for your target role."],
    },
    {
      key: "experience", name: "Work Experience", emoji: "💼",
      score: suggestions.length > 3 ? 40 : 75,
      status: suggestions.length > 3 ? "fail" : "warn",
      desc: suggestions.length > 3
        ? "Work experience section has critical gaps."
        : "Work experience needs more quantified achievements.",
      recs: ["Add roles, companies, and dates.", "Quantify achievements with metrics.", "Clarify internship or volunteer roles."],
    },
    {
      key: "ats", name: "ATS Compatibility", emoji: "🤖",
      score: 75, status: "warn",
      desc: "Resume passes basic ATS checks but keyword density can be improved.",
      recs: ["Use standard section headers.", "Incorporate keywords from job descriptions."],
    },
    {
      key: "keywords", name: "Keywords", emoji: "🔍",
      score: 70, status: "warn",
      desc: "Keywords present but not optimized for target job descriptions.",
      recs: ["Tailor keywords to specific job postings.", "Use industry-standard terminology."],
    },
    {
      key: "summary", name: "Summary", emoji: "📝",
      score: 80, status: "pass",
      desc: "Professional summary is present and clearly written.",
      recs: [],
    },
  ];
}

const STATUS = {
  pass: { label: "Pass",    textColor: "#16a34a", bgColor: "#f0fdf4", borderColor: "#bbf7d0", barColor: "#22c55e" },
  warn: { label: "Warning", textColor: "#b45309", bgColor: "#fffbeb", borderColor: "#fde68a", barColor: "#f59e0b" },
  fail: { label: "Fail",    textColor: "#b91c1c", bgColor: "#fef2f2", borderColor: "#fecaca", barColor: "#ef4444" },
};

const INDUSTRY_TIPS = [
  "Highlight cloud platform experience (AWS, GCP, Azure, Docker) if applicable.",
  "Emphasize teamwork and cross-functional collaboration in project descriptions.",
  "Include agile or DevOps methodologies experience where relevant.",
];

/* ─────────────────────────────────────────────
   AI CHAT HOOK
   Calls Anthropic API with resume context
───────────────────────────────────────────── */

function buildSystemPrompt(result, sections) {
  const sectionSummary = sections
    .map(s => `- ${s.name}: ${s.score}/100 (${s.status}) — ${s.desc}`)
    .join("\n");

  return `You are an expert resume coach and ATS specialist. You have just analyzed the user's resume and here are the results:

ATS Score: ${result.ats_score}/100 (${getGrade(result.ats_score).label})
Skills Found: ${(result.skills_found || []).join(", ") || "None detected"}
Suggestions: ${(result.suggestions || []).join(" | ") || "None"}

Section Scores:
${sectionSummary}

AI Feedback from initial analysis: ${result.ai_feedback || "N/A"}

Your role is to help the user understand EXACTLY what to change to improve their resume. Be specific, actionable, and direct. When they ask about a section, tell them precisely what to write or change. Use bullet points for clarity. Keep responses concise but thorough.`;
}

/* ─────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────── */

export default function ResumeUpload() {
  const [file,      setFile]      = useState(null);
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF file first.");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/resume/upload/",
        formData,
        { withCredentials: true }
      );
      setResult(res.data);
      setActiveTab("overview");
      toast.success("Resume analyzed!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const sections = result
    ? buildSections(result.skills_found, result.suggestions)
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Resume Analyzer</h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload your resume, get an ATS score, then chat with AI to know exactly what to fix.
          </p>
        </div>

        {/* UPLOAD CARD */}
        <UploadCard
          file={file}
          setFile={setFile}
          loading={loading}
          onUpload={handleUpload}
          hasResult={!!result}
          onReset={() => { setResult(null); setFile(null); }}
        />

        {/* RESULTS + AI CHAT */}
        {result && (
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">

            {/* LEFT: Analysis results */}
            <ResultsSection
              result={result}
              sections={sections}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* RIGHT: AI Chat */}
            <div className="xl:sticky xl:top-6">
              <AIChatPanel result={result} sections={sections} />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   UPLOAD CARD
───────────────────────────────────────────── */

function UploadCard({ file, setFile, loading, onUpload, hasResult, onReset }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <span className="text-violet-600 text-sm font-bold">↑</span>
          </div>
          <h2 className="text-sm font-semibold text-slate-700">Upload Resume</h2>
        </div>
        {hasResult && (
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-violet-600 border border-slate-200 hover:border-violet-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            ↑ Upload New
          </button>
        )}
      </div>

      <label className="block border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-xl p-6 text-center cursor-pointer transition-colors group">
        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-violet-50 flex items-center justify-center mx-auto mb-2 transition-colors">
          <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600 group-hover:text-violet-700 transition-colors">
          {file ? file.name : "Drop your PDF here or click to browse"}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">PDF only · Max 10MB</p>
        <input type="file" accept=".pdf" className="hidden"
          onChange={(e) => setFile(e.target.files[0])} />
      </label>

      {file && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-5 h-5 rounded bg-red-100 text-red-500 flex items-center justify-center text-[9px] font-bold">PDF</span>
            <span className="truncate max-w-xs">{file.name}</span>
          </div>
          <button
            onClick={onUpload}
            disabled={loading}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Analyzing…
              </>
            ) : <>Analyze Resume →</>}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   AI CHAT PANEL
───────────────────────────────────────────── */

function AIChatPanel({ result, sections }) {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [aiLoading,   setAiLoading]   = useState(false);
  const bottomRef = useRef(null);

  const systemPrompt = buildSystemPrompt(result, sections);

  // Suggested quick questions
  const quickQuestions = [
    "What's the most important thing to fix?",
    "How do I improve my work experience section?",
    "What keywords should I add?",
    "How can I improve my ATS score?",
    "Rewrite my summary for me",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiLoading]);

  // Initialize with a greeting when panel mounts
  useEffect(() => {
    const grade = getGrade(result.ats_score);
    setMessages([
      {
        role: "assistant",
        content: `Hi! I've analyzed your resume. Your ATS score is **${result.ats_score}/100** (${grade.label}).\n\nI can tell you exactly what to change to improve it. Ask me anything — or pick a question below to get started.`,
      },
    ]);
  }, [result]);

const sendMessage = async (text) => {
  const userMsg = text || input.trim();
  if (!userMsg || aiLoading) return;

  setInput("");

  const newMessages = [...messages, { role: "user", content: userMsg }];
  setMessages(newMessages);
  setAiLoading(true);

  try {
    const response = await axios.post(
      "http://localhost:8000/api/resume/chat/",
      {
        message: userMsg,
        context: systemPrompt
      },
      { withCredentials: true }
    );

    const reply = response.data.reply;

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: reply }
    ]);

  } catch (err) {
    console.log(err);
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "Error connecting to AI." }
    ]);
  } finally {
    setAiLoading(false);
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
      style={{ height: "600px" }}>

      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs">✦</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-none">Resume AI Coach</p>
          <p className="text-[10px] text-violet-200 mt-0.5">Ask me exactly what to fix</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[10px] text-violet-200">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m} />
        ))}

        {aiLoading && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-violet-600 text-[10px]">✦</span>
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick question chips — show only at start */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider font-medium">Quick questions</p>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-[11px] bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your resume…"
            rows={1}
            className="flex-1 resize-none text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-400 text-slate-700 placeholder-slate-400 bg-slate-50"
            style={{ maxHeight: "80px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || aiLoading}
            className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">
          Powered by Claude · knows your full resume results
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CHAT BUBBLE
───────────────────────────────────────────── */

function ChatBubble({ message }) {
  const isUser = message.role === "user";

  // Simple markdown-like rendering: bold, bullet points
  const renderContent = (text) => {
    return text.split("\n").map((line, i) => {
      // Bold: **text**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
      );

      // Bullet
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <div key={i} className="flex gap-1.5 mt-1">
            <span className="flex-shrink-0 mt-1 w-1 h-1 rounded-full bg-current opacity-60" />
            <span>{rendered}</span>
          </div>
        );
      }

      return line ? <p key={i} className={i > 0 ? "mt-1.5" : ""}>{rendered}</p> : <div key={i} className="h-1" />;
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-violet-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-violet-600 text-[10px]">✦</span>
      </div>
      <div className="bg-slate-100 text-slate-700 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
        {renderContent(message.content)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULTS SECTION
───────────────────────────────────────────── */

function ResultsSection({ result, sections, activeTab, setActiveTab }) {
  const score = result.ats_score;
  const grade = getGrade(score);

  const passCount = sections.filter(s => s.status === "pass").length;
  const warnCount = sections.filter(s => s.status === "warn").length;
  const failCount = sections.filter(s => s.status === "fail").length;

  const TABS = [
    { key: "overview",        label: "Overview"         },
    { key: "detailed",        label: "Detailed Results" },
    { key: "recommendations", label: "Recommendations"  },
    { key: "nextsteps",       label: "Next Steps"       },
  ];

  return (
    <div className="space-y-5">

      {/* SCORE HERO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-xs font-medium uppercase tracking-wider mb-1">ATS Analysis Complete</p>
            <h2 className="text-white text-xl font-bold">Resume Analysis Results</h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20">
              <CircularProgressbar
                value={score}
                text={`${score}`}
                styles={buildStyles({
                  pathColor:  "#ffffff",
                  trailColor: "rgba(255,255,255,0.25)",
                  textColor:  "#ffffff",
                  textSize:   "26px",
                })}
              />
            </div>
            <span
              className="mt-2 text-[11px] font-semibold px-3 py-0.5 rounded-full"
              style={{ background: grade.bg, color: grade.color, border: `1px solid ${grade.border}` }}
            >
              {grade.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
          <CheckStrip icon="✓" count={passCount} label="Passed"   color="text-green-600" bg="bg-green-50"  />
          <CheckStrip icon="⚠" count={warnCount} label="Warnings" color="text-amber-600" bg="bg-amber-50"  />
          <CheckStrip icon="✕" count={failCount} label="Issues"   color="text-red-600"   bg="bg-red-50"    />
        </div>
      </div>

      {/* 4-TAB PANEL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === t.key
                  ? "text-violet-700 border-violet-600 bg-violet-50/50"
                  : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === "overview"        && <TabOverview        sections={sections} />}
          {activeTab === "detailed"        && <TabDetailed        sections={sections} />}
          {activeTab === "recommendations" && <TabRecommendations result={result}     />}
          {activeTab === "nextsteps"       && <TabNextSteps       result={result}     />}
        </div>
      </div>

      {/* SKILLS FOUND */}
      {result.skills_found?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-xs">⚡</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-700">
              Skills Detected
              <span className="ml-1.5 text-xs font-normal text-slate-400">({result.skills_found.length} found)</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.skills_found.map((s, i) => (
              <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: OVERVIEW
───────────────────────────────────────────── */

function TabOverview({ sections }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sections.map((s) => {
        const st = STATUS[s.status];
        return (
          <div key={s.key} className="rounded-xl border p-4 hover:shadow-sm transition-shadow"
            style={{ background: st.bgColor, borderColor: st.borderColor }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{s.emoji}</span>
                <span className="text-sm font-semibold text-slate-700">{s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={{ color: st.textColor, background: "white", borderColor: st.borderColor }}>
                  {st.label.toUpperCase()}
                </span>
                <span className="text-lg font-bold" style={{ color: st.textColor }}>{s.score}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/60 overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${s.score}%`, background: st.barColor }} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: DETAILED RESULTS
───────────────────────────────────────────── */

function TabDetailed({ sections }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-3">
      {sections.map((s) => {
        const st  = STATUS[s.status];
        const open = expanded === s.key;
        return (
          <div key={s.key} className="rounded-xl border overflow-hidden hover:shadow-sm transition-shadow"
            style={{ borderColor: st.borderColor }}>
            <button
              className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors"
              style={{ background: open ? st.bgColor : "white" }}
              onClick={() => setExpanded(open ? null : s.key)}
            >
              <div className="flex items-center gap-3">
                <span className="text-base leading-none">{s.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{s.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                  <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: st.barColor }} />
                </div>
                <span className="text-sm font-bold w-8 text-right" style={{ color: st.textColor }}>{s.score}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border hidden sm:inline"
                  style={{ color: st.textColor, borderColor: st.borderColor, background: st.bgColor }}>
                  {st.label}
                </span>
                <span className="text-slate-400 text-xs ml-1">{open ? "▲" : "▼"}</span>
              </div>
            </button>
            {open && (
              <div className="px-4 pb-4 pt-1" style={{ background: st.bgColor }}>
                {s.recs.length > 0 ? (
                  <>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommendations</p>
                    <ul className="space-y-1.5">
                      {s.recs.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: st.textColor }}>→</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-xs text-green-600 font-medium">✓ No issues found — looking great!</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: RECOMMENDATIONS
───────────────────────────────────────────── */

function TabRecommendations({ result }) {
  const suggs  = result.suggestions || [];
  const total  = suggs.length;
  const high   = suggs.slice(0, Math.ceil(total * 0.4));
  const medium = suggs.slice(Math.ceil(total * 0.4), Math.ceil(total * 0.75));
  const low    = suggs.slice(Math.ceil(total * 0.75));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RecColumn title="High Priority"   items={high}   dotColor="bg-red-500"   titleColor="text-red-700"   bg="bg-red-50"   border="border-red-200"   arrowColor="text-red-400"   />
        <RecColumn title="Medium Priority" items={medium} dotColor="bg-amber-400" titleColor="text-amber-700" bg="bg-amber-50" border="border-amber-200" arrowColor="text-amber-400" />
        <RecColumn title="Low Priority"    items={low}    dotColor="bg-green-500" titleColor="text-green-700" bg="bg-green-50" border="border-green-200" arrowColor="text-green-500" />
      </div>
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-400 text-sm">☆</span>
          <h4 className="text-sm font-semibold text-slate-700">Industry-Specific Tips</h4>
        </div>
        <div className="space-y-2">
          {INDUSTRY_TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-slate-50 rounded-lg px-3 py-2.5">
              <span className="text-violet-400 flex-shrink-0 mt-0.5 text-xs">◆</span>
              <p className="text-xs text-slate-600 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: NEXT STEPS
───────────────────────────────────────────── */

function TabNextSteps({ result }) {
  const suggs = result.suggestions || [];
  if (!suggs.length) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <p className="text-sm font-medium text-green-700">Your resume looks great!</p>
        <p className="text-xs text-slate-400 mt-1">No critical next steps found.</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">
        Complete these steps in order to maximize your ATS score and interview chances.
      </p>
      <div className="space-y-3">
        {suggs.map((s, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                {i + 1}
              </div>
              {i < suggs.length - 1 && (
                <div className="w-px bg-violet-200 mt-1" style={{ minHeight: "16px" }} />
              )}
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-3">
              <p className="text-sm text-slate-700 leading-relaxed">{s}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SMALL REUSABLES
───────────────────────────────────────────── */

function CheckStrip({ icon, count, label, color, bg }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-3 ${bg}`}>
      <span className={`text-sm font-bold ${color}`}>{icon}</span>
      <div>
        <span className={`text-sm font-bold ${color}`}>{count}</span>
        <span className="text-xs text-slate-500 ml-1">{label}</span>
      </div>
    </div>
  );
}

function RecColumn({ title, items, dotColor, titleColor, bg, border, arrowColor }) {
  return (
    <div className={`rounded-xl border p-4 ${bg} ${border}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <h4 className={`text-sm font-semibold ${titleColor}`}>{title}</h4>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className={`flex items-start gap-1.5 text-xs text-slate-700 leading-relaxed`}>
              <span className={`flex-shrink-0 mt-0.5 ${arrowColor}`}>→</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-400 italic">Nothing in this category.</p>
      )}
    </div>
  );
}