import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import { clearAuthSession, fetchCurrentUser } from "../utils/auth";
Chart.register(...registerables);

const API = "http://localhost:8000/api/admin-panel";
const CHAT_API = "http://localhost:8000/api/chat";

const icons = {
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  interviews: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  sessions: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.894L15 14" /><rect x="1" y="6" width="14" height="12" rx="2" /></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  collapse: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>,
  expand: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>,
  statUsers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  statBan: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6 18.4 18.4" /></svg>,
  statInterview: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" /><path d="M19 10v1a7 7 0 0 1-14 0v-1" /><path d="M12 18v3" /><path d="M8 21h8" /></svg>,
  statScore: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>,
  statSpark: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8Z" /><path d="M5 19l.9 2 .9-2 2-.9-2-.9L5 15l-.9 2-.9.9 2 .9Z" /><path d="M19 15l1.1 2.5L22 18l-1.9.5L19 21l-1.1-2.5L16 18l1.9-.5Z" /></svg>,
  statLive: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M8 12h.01" /></svg>,
};

const menuItems = [
  { key: "stats", label: "Dashboard", icon: icons.dashboard },
  { key: "users", label: "Users", icon: icons.users },
  { key: "activity", label: "Activity", icon: icons.activity },
  { key: "interviews", label: "Interviews", icon: icons.interviews },
  { key: "sessions", label: "Practice Sessions", icon: icons.sessions },
];

const S = {
  app: {
    display: "flex",
    height: "100vh",
    background: "radial-gradient(circle at top left, rgba(99,102,241,0.16), transparent 24%), radial-gradient(circle at bottom right, rgba(14,165,233,0.12), transparent 22%), #09111f",
    fontFamily: "'Sora', 'Segoe UI', system-ui, sans-serif",
    color: "#e5e7eb",
    position: "relative",
    overflow: "hidden",
  },
  sidebar: (collapsed) => ({
    width: collapsed ? "64px" : "240px",
    background: "linear-gradient(180deg, rgba(8,13,27,0.96) 0%, rgba(18,26,46,0.94) 100%)",
    backdropFilter: "blur(18px)",
    display: "flex", flexDirection: "column",
    transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
    overflow: "hidden", flexShrink: 0,
    borderRight: "1px solid rgba(148,163,184,0.12)",
    boxShadow: "inset -1px 0 0 rgba(255,255,255,0.04)",
    position: "relative",
    zIndex: 2,
  }),
  navBtn: (active) => ({
    display: "flex", alignItems: "center", gap: "12px",
    padding: "12px 14px", borderRadius: "16px", border: "1px solid transparent",
    cursor: "pointer", width: "100%", textAlign: "left",
    fontSize: "13.5px", fontWeight: active ? "600" : "500",
    background: active ? "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(14,165,233,0.12))" : "transparent",
    color: active ? "#e2e8f0" : "#7c8ba1",
    borderLeft: active ? "2px solid transparent" : "2px solid transparent",
    boxShadow: active ? "0 14px 30px rgba(37,99,235,0.16)" : "none",
    transition: "all 0.18s", whiteSpace: "nowrap",
  }),
  shell: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(17,24,39,0.96))",
    position: "relative",
  },
  header: {
    background: "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.75))",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    padding: "0 32px",
    height: "78px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    backdropFilter: "blur(14px)",
  },
  main: {
    flex: 1,
    overflow: "auto",
    padding: "32px",
  },
  surface: {
    background: "linear-gradient(180deg, rgba(30,41,59,0.88), rgba(17,24,39,0.96))",
    border: "1px solid rgba(148,163,184,0.12)",
    borderRadius: "24px",
    boxShadow: "0 26px 60px rgba(2,6,23,0.28)",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
    letterSpacing: "-0.02em",
  },
};

export default function AdminPanel() {
  axios.defaults.withCredentials = true;
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [sessionSearch, setSessionSearch] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all");
  const navigate = useNavigate();
  const [pendingSessions, setPendingSessions] = useState([]);
  const [adminUser, setAdminUser] = useState(null);

  const donutRef = useRef(null);
  const barRef = useRef(null);
  const lineRef = useRef(null);
  const donutChart = useRef(null);
  const barChart = useRef(null);
  const lineChart = useRef(null);

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => setAdminUser(user))
      .catch(() => setAdminUser(null));
  }, []);

  const get = async (url, setter, baseUrl = API, options = {}) => {
    const { silent = false } = options;
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}${url}`, { withCredentials: true });
      setter(res.data);
    } catch { toast.error("Failed to load data"); }
    finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "stats") get("/stats/", setStats);
    if (tab === "users") get("/users/", setUsers);
    if (tab === "activity") get("/activity/", setActivity);
    if (tab === "interviews") get("/interviews/", setInterviews);
    if (tab === "sessions") {
      get("/rooms/", setSessions, CHAT_API);
      get("/session/pending/", setPendingSessions, "http://localhost:8000/api");
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== "sessions") return;

    const interval = setInterval(() => {
      get("/rooms/", setSessions, CHAT_API, { silent: true });
      get("/session/pending/", setPendingSessions, "http://localhost:8000/api", { silent: true });
    }, 3000);

    return () => clearInterval(interval);
  }, [tab]);


  useEffect(() => {
    if (tab !== "stats" || !stats) return;
    if (donutChart.current) donutChart.current.destroy();
    if (barChart.current) barChart.current.destroy();
    if (lineChart.current) lineChart.current.destroy();

    const chartDefaults = {
      plugins: { legend: { labels: { color: "#9ca3af", font: { size: 12 } } } },
    };

    if (donutRef.current) {
      donutChart.current = new Chart(donutRef.current, {
        type: "doughnut",
        data: {
          labels: ["Active", "Banned"],
          datasets: [{
            data: [stats.total_users - stats.banned_users, stats.banned_users],
            backgroundColor: ["#6366f1", "#ef4444"],
            borderColor: "#1a1a2e", borderWidth: 3,
          }],
        },
        options: {
          ...chartDefaults,
          cutout: "72%",
          plugins: { legend: { position: "bottom", labels: { color: "#9ca3af", padding: 16 } } },
        },
      });
    }

    if (barRef.current) {
      barChart.current = new Chart(barRef.current, {
        type: "bar",
        data: {
          labels: ["0–20", "21–40", "41–60", "61–80", "81–100"],
          datasets: [{
            label: "Interviews",
            data: [0, 0, 0, 0, 0],
            backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#6366f1"],
            borderRadius: 6,
          }],
        },
        options: {
          ...chartDefaults,
          scales: {
            x: { ticks: { color: "#6b7280" }, grid: { color: "rgba(255,255,255,0.04)" } },
            y: { ticks: { color: "#6b7280", stepSize: 1 }, grid: { color: "rgba(255,255,255,0.04)" } },
          },
          plugins: { legend: { display: false } },
        },
      });
    }

    if (lineRef.current) {
      lineChart.current = new Chart(lineRef.current, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{
            label: "New users",
            data: [1, 2, 1, 3, 2, 4, stats.new_users_this_week],
            borderColor: "#6366f1",
            backgroundColor: "rgba(99,102,241,0.08)",
            tension: 0.4, fill: true,
            pointBackgroundColor: "#6366f1", pointRadius: 4,
          }],
        },
        options: {
          ...chartDefaults,
          scales: {
            x: { ticks: { color: "#6b7280" }, grid: { color: "rgba(255,255,255,0.04)" } },
            y: { ticks: { color: "#6b7280", stepSize: 1 }, grid: { color: "rgba(255,255,255,0.04)" } },
          },
        },
      });
    }
    return () => {
      donutChart.current?.destroy();
      barChart.current?.destroy();
      lineChart.current?.destroy();
    };
  }, [stats, tab]);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API}/users/${id}/delete/`, { withCredentials: true });
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch { toast.error("Failed to delete"); }
  };

  const toggleBan = async (id) => {
    try {
      const res = await axios.post(`${API}/users/${id}/ban/`, {}, { withCredentials: true });
      toast.success(res.data.message);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: !u.is_active } : u));
    } catch { toast.error("Failed"); }
  };


  const forceCloseRoom = async (code) => {
    if (!confirm(`Force close room ${code}?`)) return;
    try {
      await axios.post(`${CHAT_API}/rooms/${code}/close/`, {}, { withCredentials: true });
      toast.success(`Room ${code} closed`);
      setSessions((prev) => prev.map((r) => r.code === code ? { ...r, is_active: false } : r));
    } catch { toast.error("Failed to close room"); }
  };

  const handleLogout = async () => {
    try { await axios.post("http://localhost:8000/api/auth/logout/", {}, { withCredentials: true }); } catch { }
    clearAuthSession();
    navigate("/login");
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSessions = sessions
    .filter((r) => {
      if (sessionFilter === "active") return r.is_active;
      if (sessionFilter === "ended") return !r.is_active;
      return true;
    })
    .filter((r) =>
      r.code.toLowerCase().includes(sessionSearch.toLowerCase()) ||
      r.created_by?.toLowerCase().includes(sessionSearch.toLowerCase())
    );

  const activeSessions = sessions.filter((r) => r.is_active).length;
  const currentPage = menuItems.find((m) => m.key === tab);


  const acceptSession = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/session/accept/${id}/`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("Session accepted");
      navigate("/room", { state: { roomCode: res.data.room_code, userRole: "admin" } });

    } catch (err) {
      console.error("Accept error:", err);
      toast.error("Failed");
    }
  };

  const openRoom = (code) => {
    navigate("/room", { state: { roomCode: code, userRole: "admin" } });
  };

  return (
    <div style={S.app}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.03), transparent)", opacity: 0.6 }} />


      <aside style={S.sidebar(collapsed)}>
        <div style={{ padding: "22px 16px", borderBottom: "1px solid rgba(148,163,184,0.12)", display: "flex", alignItems: "center", gap: "12px", minHeight: "78px" }}>
          <div style={{ width: "38px", height: "38px", background: "linear-gradient(135deg,#4f46e5,#06b6d4)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 14px 28px rgba(79,70,229,0.28)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </div>
          {!collapsed && (
            <div>
              <p style={{ color: "#f8fafc", fontSize: "16px", fontWeight: "700", margin: 0, letterSpacing: "-0.02em" }}>CareerNova</p>
              <p style={{ color: "#60a5fa", fontSize: "11px", margin: "2px 0 0", letterSpacing: "0.2em" }}>ADMIN COMMAND</p>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: "18px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {!collapsed && <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.22em", fontWeight: "700", padding: "0 6px", marginBottom: "10px" }}>NAVIGATION</p>}
          {menuItems.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} style={S.navBtn(tab === item.key)}
              onMouseEnter={(e) => { if (tab !== item.key) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(148,163,184,0.12)"; e.currentTarget.style.color = "#dbeafe"; } }}
              onMouseLeave={(e) => { if (tab !== item.key) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#7c8ba1"; } }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {item.label}

                  {item.key === "sessions" && activeSessions > 0 && (
                    <span style={{ background: "linear-gradient(135deg,#16a34a,#34d399)", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px", marginLeft: "6px", boxShadow: "0 8px 18px rgba(34,197,94,0.28)" }}>
                      {activeSessions} live
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px", borderTop: "1px solid rgba(148,163,184,0.12)" }}>
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "16px", border: "1px solid transparent", cursor: "pointer", background: "transparent", color: "#64748b", fontSize: "13px", width: "100%", marginBottom: "4px" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#cbd5e1"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(148,163,184,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            {collapsed ? icons.expand : icons.collapse}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "16px", border: "1px solid rgba(239,68,68,0.12)", cursor: "pointer", background: "rgba(127,29,29,0.12)", color: "#f87171", fontSize: "13px", width: "100%" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.14)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(127,29,29,0.12)"}
          >
            {icons.logout}
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>


      <div style={S.shell}>


        <header style={S.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: "700" }}>
                Admin Workspace
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                <span style={{ color: "#475569", fontSize: "13px" }}>Admin</span>
                <span style={{ color: "#334155" }}>/</span>
                <span style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc", letterSpacing: "-0.02em" }}>{currentPage?.label}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, rgba(79,70,229,0.18), rgba(14,165,233,0.12))", border: "1px solid rgba(99,102,241,0.18)", borderRadius: "999px", padding: "8px 14px", boxShadow: "0 14px 28px rgba(37,99,235,0.14)" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 6px rgba(34,197,94,0.12)" }}></div>
              <span style={{ fontSize: "12px", color: "#c4b5fd", fontWeight: "600" }}>
                {adminUser?.username || "Admin"}
              </span>
            </div>
            <div style={{ width: "42px", height: "42px", borderRadius: "16px", background: "linear-gradient(135deg,#4f46e5,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: "700", boxShadow: "0 14px 26px rgba(79,70,229,0.26)" }}>
              {(adminUser?.username || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>


        <main style={S.main}>

          {loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
              <div style={{ width: "32px", height: "32px", border: "3px solid rgba(99,102,241,0.2)", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* STATS */}
          {tab === "stats" && stats && !loading && (
            <div>
              <div style={{ ...S.surface, padding: "26px 28px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: "-60px", top: "-60px", width: "180px", height: "180px", borderRadius: "999px", background: "radial-gradient(circle, rgba(99,102,241,0.22), transparent 64%)" }} />
                <p style={{ margin: 0, fontSize: "12px", color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: "700" }}>Executive Snapshot</p>
                <h2 style={{ margin: "10px 0 8px", fontSize: "32px", color: "#f8fafc", fontWeight: "800", letterSpacing: "-0.04em" }}>
                  See platform health at a glance.
                </h2>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", maxWidth: "720px", lineHeight: 1.7 }}>
                  Track user growth, interview quality, and live mentor activity from one focused command center designed for quick decisions.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                {[
                  { label: "Total users", value: stats.total_users, color: "#6366f1", icon: icons.statUsers, bg: "rgba(99,102,241,0.1)" },
                  { label: "Banned users", value: stats.banned_users, color: "#ef4444", icon: icons.statBan, bg: "rgba(239,68,68,0.1)" },
                  { label: "Interviews", value: stats.total_interviews, color: "#10b981", icon: icons.statInterview, bg: "rgba(16,185,129,0.1)" },
                  { label: "Avg score", value: `${stats.avg_score}%`, color: "#f59e0b", icon: icons.statScore, bg: "rgba(245,158,11,0.1)" },
                  { label: "New this week", value: stats.new_users_this_week, color: "#8b5cf6", icon: icons.statSpark, bg: "rgba(139,92,246,0.1)" },
                  { label: "Live sessions", value: activeSessions, color: "#22c55e", icon: icons.statLive, bg: "rgba(34,197,94,0.1)" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "linear-gradient(180deg, rgba(30,41,59,0.86), rgba(15,23,42,0.96))", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "22px", padding: "22px", position: "relative", overflow: "hidden", boxShadow: "0 20px 40px rgba(2,6,23,0.22)" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(140deg, rgba(255,255,255,0.03), transparent 42%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", top: "18px", right: "18px", width: "46px", height: "46px", background: s.bg, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}>{s.icon}</div>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: "700" }}>{s.label}</p>
                    <p style={{ fontSize: "36px", fontWeight: "800", color: s.color, margin: 0, lineHeight: 1, letterSpacing: "-0.04em" }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: "20px" }}>
                <div style={{ ...S.surface, padding: "20px" }}>
                  <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 16px" }}>User growth this week</p>
                  <canvas ref={lineRef} height="180"></canvas>
                </div>
                <div style={{ ...S.surface, padding: "20px" }}>
                  <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 16px" }}>Score distribution</p>
                  <canvas ref={barRef} height="180"></canvas>
                </div>
                <div style={{ ...S.surface, padding: "20px" }}>
                  <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 16px" }}>User status</p>
                  <canvas ref={donutRef} height="180"></canvas>
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === "users" && !loading && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb", margin: 0 }}>
                  Users <span style={{ fontSize: "13px", fontWeight: "400", color: "#6b7280" }}>({filteredUsers.length})</span>
                </p>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
                  style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px 14px", color: "#e5e7eb", fontSize: "13px", outline: "none", width: "220px" }} />
              </div>
              <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["User", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: "500", color: "#6b7280", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "600", flexShrink: 0 }}>
                              {u.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: "500", color: "#f3f4f6" }}>{u.username}</p>
                              <p style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>ID #{u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#9ca3af" }}>{u.email}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: u.role === "admin" ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.06)", color: u.role === "admin" ? "#818cf8" : "#9ca3af" }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: u.is_active ? "#22c55e" : "#ef4444" }}></div>
                            <span style={{ fontSize: "12px", color: u.is_active ? "#4ade80" : "#f87171" }}>{u.is_active ? "Active" : "Banned"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>{new Date(u.date_joined).toLocaleDateString()}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => toggleBan(u.id)}
                              style={{ padding: "5px 12px", borderRadius: "8px", border: `1px solid ${u.is_active ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"}`, background: u.is_active ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.08)", cursor: "pointer", fontSize: "12px", fontWeight: "500", color: u.is_active ? "#f59e0b" : "#22c55e" }}>
                              {u.is_active ? "Ban" : "Unban"}
                            </button>
                            <button onClick={() => deleteUser(u.id)}
                              style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", cursor: "pointer", fontSize: "12px", fontWeight: "500", color: "#ef4444" }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {tab === "activity" && !loading && (
            <div>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb", margin: "0 0 20px" }}>Activity logs</p>
              <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["User", "Action", "Description", "Time"].map((h) => (
                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: "500", color: "#6b7280", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((a, i) => (
                      <tr key={a.id} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "14px 16px" }}><span style={{ color: "#818cf8", fontWeight: "500" }}>{a.user}</span></td>
                        <td style={{ padding: "14px 16px" }}><span style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>{a.action}</span></td>
                        <td style={{ padding: "14px 16px", color: "#9ca3af" }}>{a.description || "—"}</td>
                        <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>{new Date(a.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "interviews" && !loading && (
            <div>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb", margin: "0 0 20px" }}>Interview results</p>
              <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
                {interviews.length === 0 ? (
                  <div style={{ padding: "36px 24px", textAlign: "center" }}>
                    <p style={{ margin: "0 0 8px", color: "#f3f4f6", fontSize: "16px", fontWeight: "600" }}>
                      No interview results yet
                    </p>
                    <p style={{ margin: 0, color: "#9ca3af", fontSize: "13px", lineHeight: 1.6 }}>
                      Completed mock interviews will appear here once users start finishing interview sessions.
                    </p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["User", "Role", "Score", "Performance", "Date"].map((h) => (
                          <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: "500", color: "#6b7280", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {interviews.map((r, i) => (
                        <tr key={r.id} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "14px 16px", fontWeight: "500", color: "#f3f4f6" }}>{r.user}</td>
                          <td style={{ padding: "14px 16px" }}><span style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>{r.role}</span></td>
                          <td style={{ padding: "14px 16px", fontWeight: "700", color: r.score >= 70 ? "#4ade80" : r.score >= 40 ? "#f59e0b" : "#f87171", fontSize: "15px" }}>{r.score}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", maxWidth: "120px" }}>
                                <div style={{ height: "100%", borderRadius: "99px", width: `${r.score}%`, background: r.score >= 70 ? "#22c55e" : r.score >= 40 ? "#f59e0b" : "#ef4444", transition: "width 0.5s" }}></div>
                              </div>
                              <span style={{ fontSize: "11px", color: "#6b7280" }}>{r.score}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>{new Date(r.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {tab === "sessions" && !loading && (
            <div>
              <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(56,189,248,0.08))", border: "1px solid rgba(99,102,241,0.18)", borderRadius: "16px", padding: "18px 20px", marginBottom: "20px" }}>
                <p style={{ margin: "0 0 8px", color: "#f3f4f6", fontSize: "16px", fontWeight: "700" }}>
                  Mentor Call Flow
                </p>
                <p style={{ margin: "0 0 6px", color: "#9ca3af", fontSize: "13px", lineHeight: 1.6 }}>
                  1. The user opens <span style={{ color: "#c4b5fd", fontFamily: "monospace" }}>/room</span> and clicks <strong>Start Practice</strong>.
                </p>
                <p style={{ margin: "0 0 6px", color: "#9ca3af", fontSize: "13px", lineHeight: 1.6 }}>
                  2. Their request appears below in <strong>Pending Requests</strong>.
                </p>
                <p style={{ margin: 0, color: "#9ca3af", fontSize: "13px", lineHeight: 1.6 }}>
                  3. Click <strong>Accept</strong> to open the room and start the admin-to-user mentor video call.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                {[
                  { label: "Total rooms", value: sessions.length, color: "#818cf8" },
                  { label: "Active now", value: activeSessions, color: "#22c55e" },
                  { label: "Ended", value: sessions.filter((r) => !r.is_active).length, color: "#f59e0b" },
                  { label: "Pending requests", value: pendingSessions.length, color: "#38bdf8" },
                ].map((item) => (
                  <div key={item.label} style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "18px" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: "30px", fontWeight: 700, color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {pendingSessions.length > 0 ? (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 mb-5">

                  <p className="text-gray-100 text-sm font-semibold mb-3">
                    Pending Requests
                  </p>

                  {pendingSessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between py-2 border-b border-gray-700 last:border-none"
                    >
                      <span className="text-gray-400 text-sm">
                        {s.user}
                      </span>

                      <button
                        onClick={() => acceptSession(s.id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg transition"
                      >
                        Accept
                      </button>
                    </div>
                  ))}

                </div>
              ) : (
                <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "18px", marginBottom: "20px" }}>
                  <p style={{ margin: "0 0 6px", color: "#f3f4f6", fontSize: "14px", fontWeight: "600" }}>No pending mentor requests</p>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>
                    When a user clicks Start Practice, their request will appear here and you can accept it to join the live mentor call.
                  </p>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb", margin: 0 }}>
                  Room Sessions <span style={{ fontSize: "13px", fontWeight: "400", color: "#6b7280" }}>({filteredSessions.length})</span>
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input
                    value={sessionSearch}
                    onChange={(e) => setSessionSearch(e.target.value)}
                    placeholder="Search by room or host..."
                    style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px 14px", color: "#e5e7eb", fontSize: "13px", outline: "none", width: "240px" }}
                  />
                  <select
                    value={sessionFilter}
                    onChange={(e) => setSessionFilter(e.target.value)}
                    style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px 14px", color: "#e5e7eb", fontSize: "13px", outline: "none" }}
                  >
                    <option value="all">All rooms</option>
                    <option value="active">Active only</option>
                    <option value="ended">Ended only</option>
                  </select>
                </div>
              </div>

              <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
                {filteredSessions.length === 0 ? (
                  <div style={{ padding: "32px", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
                    No room sessions found for the current filter.
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Room", "Host", "Created", "Status", "Participants", "Actions"].map((h) => (
                          <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: "500", color: "#6b7280", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.map((room, index) => (
                        <tr
                          key={room.code}
                          style={{ borderTop: index > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "14px 16px" }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: "600", color: "#f3f4f6", fontFamily: "monospace", letterSpacing: "0.08em" }}>{room.code}</p>
                              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "12px" }}>Room code</p>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#9ca3af" }}>{room.created_by || "Unknown"}</td>
                          <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>{room.created_at ? new Date(room.created_at).toLocaleString() : "Unknown"}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background: room.is_active ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
                              color: room.is_active ? "#4ade80" : "#fbbf24",
                            }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: room.is_active ? "#22c55e" : "#f59e0b" }}></span>
                              {room.is_active ? "Live" : "Ended"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#9ca3af" }}>
                            {Array.isArray(room.participants) ? room.participants.length : (room.participant_count ?? "—")}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            {room.is_active ? (
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                <button
                                  onClick={() => openRoom(room.code)}
                                  style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#22c55e" }}
                                >
                                  Join call
                                </button>
                                <button
                                  onClick={() => forceCloseRoom(room.code)}
                                  style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#ef4444" }}
                                >
                                  End room
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: "#6b7280", fontSize: "12px" }}>No actions</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

