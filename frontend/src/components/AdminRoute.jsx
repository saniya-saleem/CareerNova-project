import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | admin | denied

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin-panel/check/", { withCredentials: true })
      .then(() => setStatus("admin"))
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">Checking access...</p>
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/" replace />;
  }

  return children;
}