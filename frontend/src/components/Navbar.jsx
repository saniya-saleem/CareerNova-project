import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await axios.get("http://localhost:8000/api/auth/user-info/", { withCredentials: true });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkUser();

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout/", {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
        : "bg-white/60 backdrop-blur-sm"
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46Z" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">CareerNova</span>
        </div>

        {/* Middle Links */}
        <div className="hidden md:flex items-center gap-1">
          <span
            onClick={() => navigate("/")}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-150"
          >
            Home
          </span>
          <span
            onClick={() => navigate("/resume-upload")}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-150"
          >
            Resume Analyzer
          </span>
          <span
            onClick={() => navigate("/mock-interview")}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-150"
          >
            Mock Interview
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-150"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-lg shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get started
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-150"
              >
                Profile
              </button>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 rounded-lg transition-all duration-150"
              >
                Log out
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}