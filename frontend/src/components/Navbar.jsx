import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <span className="text-xl font-extrabold">CareerNova</span>
        </div>

        
        <div className="hidden md:flex items-center gap-10">
          <a className="text-sm font-semibold hover:text-indigo-600">Features</a>
          <a className="text-sm font-semibold hover:text-indigo-600">Pricing</a>
          <a className="text-sm font-semibold hover:text-indigo-600">Testimonials</a>
        </div>

        
        <div className="flex gap-3">
      <button
      onClick={() => navigate("/login")}
      className="px-6 py-2 text-sm font-bold hover:bg-indigo-50 rounded-full"
    >
      Login
    </button>

    <button
      onClick={() => navigate("/register")}
      className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full"
    >
      Register
    </button>
        </div>

      </div>
    </nav>
  );
}    



