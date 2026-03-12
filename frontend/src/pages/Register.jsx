import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  const getPasswordError = () => {
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(form.password)) {
      return "Must include at least one uppercase letter";
    }
    if (!/[0-9]/.test(form.password)) {
      return "Must include at least one number";
    }
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

      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      toast.error(
        err?.email?.[0] ||
        err?.username?.[0] ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-4 border border-gray-200"
      >
        <div className="text-center mb-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Account
          </h2>
        </div>

        <input
          placeholder="Username"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 ${
              getPasswordError()
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-4 cursor-pointer text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {getPasswordError() && (
          <p className="text-sm text-red-500">{getPasswordError()}</p>
        )}

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 ${
              getConfirmError()
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-4 cursor-pointer text-gray-500"
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {getConfirmError() && (
          <p className="text-sm text-red-500">{getConfirmError()}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 w-full rounded-md font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}