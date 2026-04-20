import { useState } from "react";
import { loginUser } from "../api/auth";
import GoogleLoginBtn from "../components/GoogleLoginBtn";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, LayoutDashboard } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser(form);
      console.log("Login response:", response);
      toast.success("Welcome back! 🚀");

      // Redirect based on role
      if (response?.user?.role === "admin") {
         navigate("/admin-panel");
      } else {
         navigate("/dashboard"); 
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      toast.error(
        err?.message ||
        err?.error ||
        "Invalid email or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex surface-grid">
      <Toaster position="top-center" />
      
      {/* Left side: Branding / Abstract Art */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.3),_transparent_30%),linear-gradient(155deg,_#0b1120_0%,_#111827_48%,_#172554_100%)]" />
        <div className="blob bg-white/10 top-[-18%] right-[-12%]" />
        <div className="blob bg-cyan-400/10 bottom-[-20%] left-[-12%]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 p-12 max-w-xl text-white"
        >
          <div className="w-14 h-14 bg-white/12 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
             <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <p className="uppercase tracking-[0.28em] text-xs text-cyan-200/80 mb-5">
            CareerNova Workspace
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Step back into your career command center.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
            Review resume signals, join mentor-led practice calls, and keep every interview workflow in one sharp, focused space.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              ["Mentor Calls", "Live admin-user sessions"],
              ["ATS Review", "Sharper resume feedback"],
              ["Interview Prep", "Practice in real time"],
              ["Progress", "Track every improvement"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-md">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto space-y-8 rounded-[2rem] border border-white/60 bg-white/82 p-8 shadow-[0_35px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl panel-glow"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
               <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                 <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46Z" />
               </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--text-main)]">CareerNova</span>
          </div>

          <div className="text-left">
            <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
              Sign In
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-[var(--text-main)] tracking-tight">Welcome back</h2>
            <p className="text-[var(--text-muted)] mt-2">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative group">
              <label className="text-sm font-semibold text-[var(--text-main)]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="input-base pl-12 h-14"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--text-main)]">Password</label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input-base pl-12 h-14"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Checking...
                </span>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-main)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--bg-surface)] text-[var(--text-muted)] font-medium">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <div className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 *:w-full *:flex *:justify-center">
               <GoogleLoginBtn />
            </div>
          </div>

          <p className="text-center text-[var(--text-muted)] mt-10">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-primary-600 font-semibold cursor-pointer hover:underline"
            >
              Sign up free
            </span>
          </p>

        </motion.div>
      </div>
    </div>
  );
}
