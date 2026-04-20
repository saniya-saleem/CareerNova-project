import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden hero-gradient min-h-[90vh] flex flex-col justify-center">
      
      {/* Decorative Blobs */}
      <div className="blob top-[-150px] left-[-150px] opacity-60 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="blob bottom-[10%] right-[-150px] opacity-60 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-widest mb-8 border border-primary-100 dark:border-primary-500/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
          </span>
          Next-Gen AI Mock Interview
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight mb-8 text-[var(--text-main)] w-full"
        >
          Master Your Career with <br />
          <span className="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent pb-2">
            AI-Powered Intelligence
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Optimize your resume for ATS standard compliance and ace your next interview natively with real-time AI feedback and precise competitive performance metrics.
        </motion.p>

        {/* Call to Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <button 
            onClick={() => navigate("/register")}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl shadow-lg shadow-primary-500/25 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>

          <button 
             onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[var(--bg-surface)] hover:bg-gray-50 border border-[var(--border-main)] text-[var(--text-main)] font-semibold rounded-2xl shadow-sm transition-all duration-300 active:scale-95 hover:shadow-md dark:hover:bg-slate-800 w-full sm:w-auto"
          >
            <PlayCircle className="w-5 h-5 text-[var(--text-muted)]" />
            Sign in & Test Drive
          </button>
        </motion.div>

        {/* Product Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-[var(--border-main)] bg-[var(--bg-surface)] group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_40%)] pointer-events-none" />
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-0 min-h-[420px]">
            <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-[var(--border-main)] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(248,250,252,0.95))] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.7),rgba(15,23,42,0.92))]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)] font-semibold">
                    Resume Readiness
                  </p>
                  <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--text-main)]">
                    ATS and mentor workflow in one place
                  </h3>
                </div>
                <div className="hidden md:flex h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-cyan-500/15 border border-primary-500/20 items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-cyan-400" />
                </div>
              </div>

              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                {[
                  ["87%", "ATS Match"],
                  ["12", "Resume Fixes"],
                  ["Live", "Mentor Calls"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[1.4rem] border border-[var(--border-main)] bg-white/80 dark:bg-slate-900/70 p-4 shadow-sm">
                    <p className="text-2xl font-extrabold text-[var(--text-main)]">{value}</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.6rem] border border-[var(--border-main)] bg-white/85 dark:bg-slate-900/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text-main)]">Improvement Timeline</p>
                  <span className="text-xs rounded-full bg-emerald-500/10 text-emerald-600 px-3 py-1 font-semibold">+18% this week</span>
                </div>
                <div className="mt-6 flex items-end gap-3 h-36">
                  {[45, 72, 58, 84, 68, 92, 80].map((height, index) => (
                    <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-primary-600 to-cyan-500/70" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(241,245,249,0.98))] dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.78),rgba(15,23,42,0.96))]">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)] font-semibold">
                Live Practice Session
              </p>
              <div className="mt-5 rounded-[1.8rem] border border-[var(--border-main)] bg-[#07101f] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/8 bg-white/[0.04] px-4 py-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500 font-semibold">Mentor Room</p>
                    <p className="mt-1 font-mono text-lg tracking-[0.22em] text-violet-300">CNV-ROOM</p>
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Live
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-[1.4rem] border border-white/8 bg-slate-900 min-h-[190px] flex items-center justify-center text-slate-500 italic">
                    Mentor feed
                  </div>
                  <div className="rounded-[1.4rem] border border-white/8 bg-gradient-to-br from-slate-800 to-slate-900 min-h-[190px] flex items-end justify-start p-4">
                    <span className="rounded-full bg-black/35 border border-white/8 px-3 py-1 text-xs text-slate-200">Candidate</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  {["Audio", "Mute", "Camera", "End"].map((label) => (
                    <div key={label} className="flex-1 rounded-[1.1rem] border border-white/8 bg-white/[0.03] px-3 py-4 text-center text-xs font-semibold text-slate-300">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
