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

      const response = await loginUser(form);

      console.log("Login response:", response);

      alert("Login successful ✅");

      // redirect after login
      navigate("/");

    } catch (err) {

      console.log("LOGIN ERROR:", err);

      alert(
        err?.message ||
        err?.error ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-5"
      >

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <p className="text-gray-500 text-sm">
            Welcome back to CareerNova
          </p>
        </div>

        <input
          placeholder="Email"
          className="border border-gray-300 rounded-lg p-3 w-full"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Password"
          type="password"
          className="border border-gray-300 rounded-lg p-3 w-full"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white p-3 w-full rounded-lg hover:bg-indigo-700"
        >
          Login
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-gray-300 flex-1" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-px bg-gray-300 flex-1" />
        </div>

        <div className="flex justify-center">
          <GoogleLoginBtn />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </form>
    </div>
  );
}