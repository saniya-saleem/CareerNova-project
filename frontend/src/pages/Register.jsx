import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Mail, User, Lock, ArrowRight, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getRegisterErrorMessage = (err) => {
    if (!err) return "Registration failed";
    if (typeof err === "string") return err;
    if (Array.isArray(err)) return err[0];
    if (err.username?.[0]) return `Username: ${err.username[0]}`;
    if (err.email?.[0]) return `Email: ${err.email[0]}`;
    if (err.password?.[0]) return `Password: ${err.password[0]}`;
    if (err.detail) return err.detail;
    return "Registration failed";
  };

  const getPasswordError = () => {
    if (!form.password) return "";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(form.password)) return "Must include at least one uppercase letter";
    if (!/[0-9]/.test(form.password)) return "Must include at least one number";
    return "";
  };

  const getConfirmError = () => {
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = getPasswordError();
    const confirmError = getConfirmError();

    if (passwordError || confirmError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      toast.success("Account created successfully! 🚀");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error("Register error:", err);
      toast.error(getRegisterErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex surface-grid">
      <Toaster position="top-center" />
      
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
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

          <div className="text-left mb-8">
            <div className="inline-flex items-center rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Join CareerNova
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-[var(--text-main)] tracking-tight">Create your account</h2>
            <p className="text-[var(--text-muted)] mt-2">
              Join thousands optimizing their careers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2 relative group">
              <label className="text-sm font-semibold text-[var(--text-main)]">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="johndoe"
                  className="input-base pl-12 h-14"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <label className="text-sm font-semibold text-[var(--text-main)]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="input-base pl-12 h-14"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <label className="text-sm font-semibold text-[var(--text-main)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input-base pl-12 pr-12 h-14 ${getPasswordError() ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {getPasswordError() && <p className="text-xs text-red-500 font-medium mt-1">{getPasswordError()}</p>}
            </div>

            <div className="space-y-2 relative group">
              <label className="text-sm font-semibold text-[var(--text-main)]">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input-base pl-12 pr-12 h-14 ${getConfirmError() ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {getConfirmError() && <p className="text-xs text-red-500 font-medium mt-1">{getConfirmError()}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || getPasswordError() || getConfirmError()}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            <p className="text-center text-[var(--text-muted)] mt-8">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-primary-600 font-semibold cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right side: Branding area (reversed side from login for a nice flow) */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden border-l border-[var(--border-main)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_26%),linear-gradient(160deg,_#f8fbff_0%,_#eef4ff_40%,_#e6eefb_100%)]" />
        <div className="blob bg-primary-500/10 top-[-10%] right-[-10%]" />
        <div className="blob bg-violet-500/10 bottom-[-10%] left-[-10%]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 p-12 max-w-xl text-[var(--text-main)]"
        >
          <div className="w-14 h-14 bg-white/85 rounded-2xl flex items-center justify-center mb-8 border border-cyan-100 shadow-xl">
             <Lightbulb className="w-6 h-6 text-cyan-600" />
          </div>
          <p className="uppercase tracking-[0.28em] text-xs text-cyan-700 mb-5 font-semibold">
            Candidate Onboarding
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 mt-4 leading-tight">
            Build the profile your next opportunity remembers.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Create an account to unlock mentor-led mock sessions, ATS-backed resume feedback, and a much sharper interview workflow.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "Live practice sessions with admin mentors",
              "Resume analysis with clearer ATS signals",
              "Interview preparation in one focused dashboard",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-4 shadow-sm backdrop-blur">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                <p className="text-sm font-medium text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
