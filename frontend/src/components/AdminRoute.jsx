import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | admin | denied
  const [reason, setReason] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin-panel/check/", {
        withCredentials: true,
      })
      .then(() => setStatus("admin"))
      .catch((error) => {
        const code = error?.response?.status;
        if (code === 401) {
          setReason("Please sign in first to continue to the admin panel.");
        } else if (code === 403) {
          setReason("This account does not have admin permission.");
        } else {
          setReason("Unable to verify admin access right now.");
        }
        setStatus("denied");
      });
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">Checking access...</p>
      </div>
    );
  }

  if (status === "denied") {
    if (reason === "Please sign in first to continue to the admin panel.") {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-6">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-[var(--bg-surface)] p-8 text-center shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
            Admin Access
          </p>
          <h2 className="mt-4 text-2xl font-bold text-[var(--text-main)]">
            Access denied
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            {reason || "This page is only available for admin accounts."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-[var(--text-main)] transition hover:border-white/20 hover:bg-white/5"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/login"
              className="rounded-full bg-primary-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-500"
            >
              Sign in again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
