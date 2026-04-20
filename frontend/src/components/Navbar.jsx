import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, User, LayoutDashboard, BrainCircuit, Activity, FileText } from "lucide-react";
import { clearAuthSession, fetchCurrentUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await fetchCurrentUser();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkUser();

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout/", {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      clearAuthSession();
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  const navLinks = [
    { name: "Resume Analyzer", path: "/resume-upload", icon: <FileText className="w-4 h-4" /> },
    { name: "Mock Interview", path: "/mock-interview", icon: <Activity className="w-4 h-4" /> },
    { name: "Practice Session", path: "/room", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "AI Chat", path: "/chat", icon: <BrainCircuit className="w-4 h-4" /> },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[var(--bg-surface)] backdrop-blur-xl shadow-sm border-b border-[var(--border-main)] bg-opacity-80"
        : "bg-transparent border-b border-transparent"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">CareerNova</span>
        </div>

        {/* Middle Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 
                ${isActive 
                  ? "bg-[var(--text-main)] text-[var(--bg-main)] shadow-sm" 
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-semibold text-[var(--text-main)] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn-primary"
              >
                Get started
              </button>
            </>
          ) : (
             <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center p-2 rounded-xl text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-[var(--text-main)] transition-colors"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </button>
              <div className="w-px h-5 bg-[var(--border-main)] mx-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-semibold">Log out</span>
              </button>
             </div>
          )}
        </div>

      </div>
    </nav>
  );
}
