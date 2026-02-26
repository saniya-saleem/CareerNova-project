import { useState } from "react";
import { loginUser } from "../api/auth";
import GoogleLoginBtn from "../components/GoogleLoginBtn";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form);
      console.log(data);

      if (data.access) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        alert("Login success");
        navigate("/");
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
      
      {/* ⭐ Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-5"
      >
        {/* ⭐ Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <p className="text-gray-500 text-sm">Welcome back to CareerNova</p>
        </div>

        {/* ⭐ Email */}
        <input
          placeholder="Email"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* ⭐ Password */}
        <input
          placeholder="Password"
          type="password"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* ⭐ Button */}
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 w-full rounded-lg font-semibold transition">
          Login
        </button>

        {/* ⭐ Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-gray-300 flex-1" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-px bg-gray-300 flex-1" />
        </div>

        {/* ⭐ Google */}
        <div className="flex justify-center">
          <GoogleLoginBtn />
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer font-semibold"
            onClick={() => navigate("/register")}
          >
            register
          </span>
        </p>
      </form>
    </div>
  );
}