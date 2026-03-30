// // import { useEffect, useState, useRef } from "react";
// // import axios from "axios";
// // import toast from "react-hot-toast";
// // import { useNavigate } from "react-router-dom";
// // import { Chart, registerables } from "chart.js";
// // Chart.register(...registerables);

// // const API = "http://localhost:8000/api/admin-panel";

// // const icons = {
// //   dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
// //   users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
// //   activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
// //   interviews: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
// //   logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
// //   collapse: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
// //   expand: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
// // };

// // const menuItems = [
// //   { key: "stats", label: "Dashboard", icon: icons.dashboard },
// //   { key: "users", label: "Users", icon: icons.users },
// //   { key: "activity", label: "Activity", icon: icons.activity },
// //   { key: "interviews", label: "Interviews", icon: icons.interviews },
// // ];

// // const S = {
// //   sidebar: (collapsed) => ({
// //     width: collapsed ? "64px" : "240px",
// //     background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)",
// //     display: "flex", flexDirection: "column",
// //     transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
// //     overflow: "hidden", flexShrink: 0,
// //     borderRight: "1px solid rgba(255,255,255,0.06)",
// //   }),
// //   navBtn: (active) => ({
// //     display: "flex", alignItems: "center", gap: "12px",
// //     padding: "10px 12px", borderRadius: "10px", border: "none",
// //     cursor: "pointer", width: "100%", textAlign: "left",
// //     fontSize: "13.5px", fontWeight: active ? "500" : "400",
// //     background: active ? "rgba(99,102,241,0.15)" : "transparent",
// //     color: active ? "#818cf8" : "#6b7280",
// //     borderLeft: active ? "2px solid #6366f1" : "2px solid transparent",
// //     transition: "all 0.15s", whiteSpace: "nowrap",
// //   }),
// // };

// // export default function AdminPanel() {
// //   const [tab, setTab] = useState("stats");
// //   const [stats, setStats] = useState(null);
// //   const [users, setUsers] = useState([]);
// //   const [activity, setActivity] = useState([]);
// //   const [interviews, setInterviews] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [collapsed, setCollapsed] = useState(false);
// //   const [search, setSearch] = useState("");
// //   const navigate = useNavigate();

// //   const donutRef = useRef(null);
// //   const barRef = useRef(null);
// //   const lineRef = useRef(null);
// //   const donutChart = useRef(null);
// //   const barChart = useRef(null);
// //   const lineChart = useRef(null);

// //   const get = async (url, setter) => {
// //     setLoading(true);
// //     try {
// //       const res = await axios.get(`${API}${url}`, { withCredentials: true });
// //       setter(res.data);
// //     } catch { toast.error("Failed to load data"); }
// //     finally { setLoading(false); }
// //   };

// //   useEffect(() => {
// //     if (tab === "stats") get("/stats/", setStats);
// //     if (tab === "users") get("/users/", setUsers);
// //     if (tab === "activity") get("/activity/", setActivity);
// //     if (tab === "interviews") get("/interviews/", setInterviews);
// //   }, [tab]);

// //   // Charts
// //   useEffect(() => {
// //     if (tab !== "stats" || !stats) return;

// //     // Destroy old
// //     if (donutChart.current) donutChart.current.destroy();
// //     if (barChart.current) barChart.current.destroy();
// //     if (lineChart.current) lineChart.current.destroy();

// //     const chartDefaults = {
// //       plugins: { legend: { labels: { color: "#9ca3af", font: { size: 12 } } } },
// //     };

// //     // Donut — user breakdown
// //     if (donutRef.current) {
// //       donutChart.current = new Chart(donutRef.current, {
// //         type: "doughnut",
// //         data: {
// //           labels: ["Active", "Banned"],
// //           datasets: [{
// //             data: [stats.total_users - stats.banned_users, stats.banned_users],
// //             backgroundColor: ["#6366f1", "#ef4444"],
// //             borderColor: "#1a1a2e", borderWidth: 3,
// //           }],
// //         },
// //         options: {
// //           ...chartDefaults,
// //           cutout: "72%",
// //           plugins: { legend: { position: "bottom", labels: { color: "#9ca3af", padding: 16 } } },
// //         },
// //       });
// //     }

// //     // Bar — interviews by score range
// //     if (barRef.current) {
// //       barChart.current = new Chart(barRef.current, {
// //         type: "bar",
// //         data: {
// //           labels: ["0–20", "21–40", "41–60", "61–80", "81–100"],
// //           datasets: [{
// //             label: "Interviews",
// //             data: [0, 0, 0, 0, 0],
// //             backgroundColor: ["#ef4444","#f97316","#eab308","#22c55e","#6366f1"],
// //             borderRadius: 6,
// //           }],
// //         },
// //         options: {
// //           ...chartDefaults,
// //           scales: {
// //             x: { ticks: { color: "#6b7280" }, grid: { color: "rgba(255,255,255,0.04)" } },
// //             y: { ticks: { color: "#6b7280", stepSize: 1 }, grid: { color: "rgba(255,255,255,0.04)" } },
// //           },
// //           plugins: { legend: { display: false } },
// //         },
// //       });
// //     }

// //     // Line — user growth (mock weekly)
// //     if (lineRef.current) {
// //       lineChart.current = new Chart(lineRef.current, {
// //         type: "line",
// //         data: {
// //           labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
// //           datasets: [{
// //             label: "New users",
// //             data: [1, 2, 1, 3, 2, 4, stats.new_users_this_week],
// //             borderColor: "#6366f1",
// //             backgroundColor: "rgba(99,102,241,0.08)",
// //             tension: 0.4, fill: true,
// //             pointBackgroundColor: "#6366f1", pointRadius: 4,
// //           }],
// //         },
// //         options: {
// //           ...chartDefaults,
// //           scales: {
// //             x: { ticks: { color: "#6b7280" }, grid: { color: "rgba(255,255,255,0.04)" } },
// //             y: { ticks: { color: "#6b7280", stepSize: 1 }, grid: { color: "rgba(255,255,255,0.04)" } },
// //           },
// //         },
// //       });
// //     }

// //     return () => {
// //       donutChart.current?.destroy();
// //       barChart.current?.destroy();
// //       lineChart.current?.destroy();
// //     };
// //   }, [stats, tab]);

// //   const deleteUser = async (id) => {
// //     if (!confirm("Delete this user?")) return;
// //     try {
// //       await axios.delete(`${API}/users/${id}/delete/`, { withCredentials: true });
// //       toast.success("User deleted");
// //       setUsers((prev) => prev.filter((u) => u.id !== id));
// //     } catch { toast.error("Failed to delete"); }
// //   };

// //   const toggleBan = async (id) => {
// //     try {
// //       const res = await axios.post(`${API}/users/${id}/ban/`, {}, { withCredentials: true });
// //       toast.success(res.data.message);
// //       setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: !u.is_active } : u));
// //     } catch { toast.error("Failed"); }
// //   };

// //   const handleLogout = async () => {
// //     try { await axios.post("http://localhost:8000/api/auth/logout/", {}, { withCredentials: true }); } catch {}
// //     navigate("/login");
// //   };

// //   const filteredUsers = users.filter((u) =>
// //     u.username.toLowerCase().includes(search.toLowerCase()) ||
// //     u.email.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const currentPage = menuItems.find((m) => m.key === tab);

// //   return (
// //     <div style={{ display: "flex", height: "100vh", background: "#0f0f1a", fontFamily: "'Inter', system-ui, sans-serif", color: "#e5e7eb" }}>

// //       {/* SIDEBAR */}
// //       <aside style={S.sidebar(collapsed)}>
// //         {/* Logo */}
// //         <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px", minHeight: "68px" }}>
// //           <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
// //             <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
// //           </div>
// //           {!collapsed && (
// //             <div>
// //               <p style={{ color: "#f9fafb", fontSize: "14px", fontWeight: "600", margin: 0 }}>CareerNova</p>
// //               <p style={{ color: "#6366f1", fontSize: "11px", margin: 0, letterSpacing: "0.08em" }}>ADMIN PANEL</p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Nav */}
// //         <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
// //           {!collapsed && <p style={{ color: "#374151", fontSize: "10px", letterSpacing: "0.1em", fontWeight: "600", padding: "0 4px", marginBottom: "8px" }}>NAVIGATION</p>}
// //           {menuItems.map((item) => (
// //             <button key={item.key} onClick={() => setTab(item.key)} style={S.navBtn(tab === item.key)}
// //               onMouseEnter={(e) => { if (tab !== item.key) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#d1d5db"; }}}
// //               onMouseLeave={(e) => { if (tab !== item.key) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}}
// //             >
// //               <span style={{ flexShrink: 0 }}>{item.icon}</span>
// //               {!collapsed && <span>{item.label}</span>}
// //             </button>
// //           ))}
// //         </nav>

// //         {/* Bottom */}
// //         <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
// //           <button onClick={() => setCollapsed(!collapsed)}
// //             style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", background: "transparent", color: "#4b5563", fontSize: "13px", width: "100%", marginBottom: "4px" }}
// //             onMouseEnter={(e) => e.currentTarget.style.color = "#9ca3af"}
// //             onMouseLeave={(e) => e.currentTarget.style.color = "#4b5563"}
// //           >
// //             {collapsed ? icons.expand : icons.collapse}
// //             {!collapsed && <span>Collapse</span>}
// //           </button>
// //           <button onClick={handleLogout}
// //             style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", background: "transparent", color: "#ef4444", fontSize: "13px", width: "100%" }}
// //             onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
// //             onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
// //           >
// //             {icons.logout}
// //             {!collapsed && <span>Logout</span>}
// //           </button>
// //         </div>
// //       </aside>

// //       {/* MAIN */}
// //       <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#111827" }}>

// //         {/* Topbar */}
// //         <header style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
// //           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
// //             <span style={{ color: "#4b5563", fontSize: "13px" }}>Admin</span>
// //             <span style={{ color: "#374151" }}>/</span>
// //             <span style={{ fontSize: "13px", fontWeight: "500", color: "#e5e7eb" }}>{currentPage?.label}</span>
// //           </div>
// //           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
// //             <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "20px", padding: "4px 12px" }}>
// //               <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }}></div>
// //               <span style={{ fontSize: "12px", color: "#818cf8" }}>saniyasaleen2821</span>
// //             </div>
// //             <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "600" }}>S</div>
// //           </div>
// //         </header>

// //         {/* Content */}
// //         <main style={{ flex: 1, overflow: "auto", padding: "28px" }}>

// //           {loading && (
// //             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
// //               <div style={{ width: "32px", height: "32px", border: "3px solid rgba(99,102,241,0.2)", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
// //               <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
// //             </div>
// //           )}

// //           {/* STATS */}
// //           {tab === "stats" && stats && !loading && (
// //             <div>
// //               {/* Stat Cards */}
// //               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
// //                 {[
// //                   { label: "Total users", value: stats.total_users, color: "#6366f1", icon: "👥", bg: "rgba(99,102,241,0.1)" },
// //                   { label: "Banned users", value: stats.banned_users, color: "#ef4444", icon: "🚫", bg: "rgba(239,68,68,0.1)" },
// //                   { label: "Interviews", value: stats.total_interviews, color: "#10b981", icon: "🎤", bg: "rgba(16,185,129,0.1)" },
// //                   { label: "Avg score", value: `${stats.avg_score}%`, color: "#f59e0b", icon: "📊", bg: "rgba(245,158,11,0.1)" },
// //                   { label: "New this week", value: stats.new_users_this_week, color: "#8b5cf6", icon: "✨", bg: "rgba(139,92,246,0.1)" },
// //                 ].map((s) => (
// //                   <div key={s.label} style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", position: "relative", overflow: "hidden" }}>
// //                     <div style={{ position: "absolute", top: "16px", right: "16px", width: "40px", height: "40px", background: s.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{s.icon}</div>
// //                     <p style={{ fontSize: "11px", color: "#6b7280", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
// //                     <p style={{ fontSize: "32px", fontWeight: "700", color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Charts Row */}
// //               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: "20px" }}>
// //                 {/* Line Chart */}
// //                 <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
// //                   <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 16px" }}>User growth this week</p>
// //                   <canvas ref={lineRef} height="180"></canvas>
// //                 </div>

// //                 {/* Bar Chart */}
// //                 <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
// //                   <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 16px" }}>Score distribution</p>
// //                   <canvas ref={barRef} height="180"></canvas>
// //                 </div>

// //                 {/* Donut */}
// //                 <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
// //                   <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 16px" }}>User status</p>
// //                   <canvas ref={donutRef} height="180"></canvas>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* USERS */}
// //           {tab === "users" && !loading && (
// //             <div>
// //               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
// //                 <p style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb", margin: 0 }}>
// //                   Users <span style={{ fontSize: "13px", fontWeight: "400", color: "#6b7280" }}>({filteredUsers.length})</span>
// //                 </p>
// //                 <input
// //                   value={search}
// //                   onChange={(e) => setSearch(e.target.value)}
// //                   placeholder="Search users..."
// //                   style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px 14px", color: "#e5e7eb", fontSize: "13px", outline: "none", width: "220px" }}
// //                 />
// //               </div>
// //               <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
// //                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
// //                   <thead>
// //                     <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
// //                       {["User", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
// //                         <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: "500", color: "#6b7280", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {filteredUsers.map((u, i) => (
// //                       <tr key={u.id} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
// //                         onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
// //                         onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
// //                       >
// //                         <td style={{ padding: "14px 16px" }}>
// //                           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// //                             <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "600", flexShrink: 0 }}>
// //                               {u.username[0].toUpperCase()}
// //                             </div>
// //                             <div>
// //                               <p style={{ margin: 0, fontWeight: "500", color: "#f3f4f6" }}>{u.username}</p>
// //                               <p style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>ID #{u.id}</p>
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td style={{ padding: "14px 16px", color: "#9ca3af" }}>{u.email}</td>
// //                         <td style={{ padding: "14px 16px" }}>
// //                           <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: u.role === "admin" ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.06)", color: u.role === "admin" ? "#818cf8" : "#9ca3af" }}>
// //                             {u.role}
// //                           </span>
// //                         </td>
// //                         <td style={{ padding: "14px 16px" }}>
// //                           <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
// //                             <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: u.is_active ? "#22c55e" : "#ef4444" }}></div>
// //                             <span style={{ fontSize: "12px", color: u.is_active ? "#4ade80" : "#f87171" }}>{u.is_active ? "Active" : "Banned"}</span>
// //                           </div>
// //                         </td>
// //                         <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>
// //                           {new Date(u.date_joined).toLocaleDateString()}
// //                         </td>
// //                         <td style={{ padding: "14px 16px" }}>
// //                           <div style={{ display: "flex", gap: "8px" }}>
// //                             <button onClick={() => toggleBan(u.id)}
// //                               style={{ padding: "5px 12px", borderRadius: "8px", border: `1px solid ${u.is_active ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"}`, background: u.is_active ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.08)", cursor: "pointer", fontSize: "12px", fontWeight: "500", color: u.is_active ? "#f59e0b" : "#22c55e" }}>
// //                               {u.is_active ? "Ban" : "Unban"}
// //                             </button>
// //                             <button onClick={() => deleteUser(u.id)}
// //                               style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", cursor: "pointer", fontSize: "12px", fontWeight: "500", color: "#ef4444" }}>
// //                               Delete
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}

// //           {/* ACTIVITY */}
// //           {tab === "activity" && !loading && (
// //             <div>
// //               <p style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb", margin: "0 0 20px" }}>Activity logs</p>
// //               <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
// //                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
// //                   <thead>
// //                     <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
// //                       {["User", "Action", "Description", "Time"].map((h) => (
// //                         <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: "500", color: "#6b7280", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {activity.map((a, i) => (
// //                       <tr key={a.id} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
// //                         onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
// //                         onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
// //                       >
// //                         <td style={{ padding: "14px 16px" }}>
// //                           <span style={{ color: "#818cf8", fontWeight: "500" }}>{a.user}</span>
// //                         </td>
// //                         <td style={{ padding: "14px 16px" }}>
// //                           <span style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>{a.action}</span>
// //                         </td>
// //                         <td style={{ padding: "14px 16px", color: "#9ca3af" }}>{a.description || "—"}</td>
// //                         <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>{new Date(a.created_at).toLocaleString()}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}

// //           {/* INTERVIEWS */}
// //           {tab === "interviews" && !loading && (
// //             <div>
// //               <p style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb", margin: "0 0 20px" }}>Interview results</p>
// //               <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
// //                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
// //                   <thead>
// //                     <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
// //                       {["User", "Role", "Score", "Performance", "Date"].map((h) => (
// //                         <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: "500", color: "#6b7280", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {interviews.map((r, i) => (
// //                       <tr key={r.id} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
// //                         onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
// //                         onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
// //                       >
// //                         <td style={{ padding: "14px 16px", fontWeight: "500", color: "#f3f4f6" }}>{r.user}</td>
// //                         <td style={{ padding: "14px 16px" }}>
// //                           <span style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>{r.role}</span>
// //                         </td>
// //                         <td style={{ padding: "14px 16px", fontWeight: "700", color: r.score >= 70 ? "#4ade80" : r.score >= 40 ? "#f59e0b" : "#f87171", fontSize: "15px" }}>{r.score}</td>
// //                         <td style={{ padding: "14px 16px" }}>
// //                           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// //                             <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", maxWidth: "120px" }}>
// //                               <div style={{ height: "100%", borderRadius: "99px", width: `${r.score}%`, background: r.score >= 70 ? "#22c55e" : r.score >= 40 ? "#f59e0b" : "#ef4444", transition: "width 0.5s" }}></div>
// //                             </div>
// //                             <span style={{ fontSize: "11px", color: "#6b7280" }}>{r.score}%</span>
// //                           </div>
// //                         </td>
// //                         <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>{new Date(r.created_at).toLocaleString()}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}

// //         </main>
// //       </div>
// //     </div>
// //   );
// // }

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const API = "http://localhost:8000/api/admin-panel";
const CHAT_API = "http://localhost:8000/api/chat";

const icons = {
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  interviews: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  sessions: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.894L15 14"/><rect x="1" y="6" width="14" height="12" rx="2"/></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  collapse: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  expand: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
};

const menuItems = [
  { key: "stats",     label: "Dashboard",          icon: icons.dashboard },
  { key: "users",     label: "Users",               icon: icons.users },
  { key: "activity",  label: "Activity",            icon: icons.activity },
  { key: "interviews",label: "Interviews",          icon: icons.interviews },
  { key: "sessions",  label: "Practice Sessions",   icon: icons.sessions },
];

const S = {
  sidebar: (collapsed) => ({
    width: collapsed ? "64px" : "240px",
    background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)",
    display: "flex", flexDirection: "column",
    transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
    overflow: "hidden", flexShrink: 0,
    borderRight: "1px solid rgba(255,255,255,0.06)",
  }),
  navBtn: (active) => ({
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 12px", borderRadius: "10px", border: "none",
    cursor: "pointer", width: "100%", textAlign: "left",
    fontSize: "13.5px", fontWeight: active ? "500" : "400",
    background: active ? "rgba(99,102,241,0.15)" : "transparent",
    color: active ? "#818cf8" : "#6b7280",
    borderLeft: active ? "2px solid #6366f1" : "2px solid transparent",
    transition: "all 0.15s", whiteSpace: "nowrap",
  }),
};

export default function AdminPanel() {
  const [tab, setTab]             = useState("stats");
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [activity, setActivity]   = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch]       = useState("");
  const [sessionSearch, setSessionSearch] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all"); 
  const navigate = useNavigate();
  const [pendingSessions, setPendingSessions] = useState([]);

  const donutRef = useRef(null);
  const barRef   = useRef(null);
  const lineRef  = useRef(null);
  const donutChart = useRef(null);
  const barChart   = useRef(null);
  const lineChart  = useRef(null);

  const get = async (url, setter, baseUrl = API) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}${url}`, { withCredentials: true });
      setter(res.data);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (tab === "stats")      get("/stats/", setStats);
    if (tab === "users")      get("/users/", setUsers);
    if (tab === "activity")   get("/activity/", setActivity);
    if (tab === "interviews") get("/interviews/", setInterviews);
    if (tab === "sessions") {
    get("/rooms/", setSessions, CHAT_API); 
    get("/session/pending/", setPendingSessions, "http://localhost:8000/api"); 
}
  }, [tab]);


  useEffect(() => {
    if (tab !== "stats" || !stats) return;
    if (donutChart.current) donutChart.current.destroy();
    if (barChart.current)   barChart.current.destroy();
    if (lineChart.current)  lineChart.current.destroy();

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
            backgroundColor: ["#ef4444","#f97316","#eab308","#22c55e","#6366f1"],
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
  const acceptSession = async (id) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/session/accept/${id}/`,
      {},
      { withCredentials: true }
    );

    toast.success("Session accepted");

    
    const rooms = await axios.get(`${CHAT_API}/rooms/`, { withCredentials: true });
    setSessions(rooms.data);

    const pending = await axios.get(`http://localhost:8000/api/session/pending/`, { withCredentials: true });
    setPendingSessions(pending.data);

  } catch (err) {
    console.error(err);
    toast.error("Failed to accept session");
  }
};

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
    try { await axios.post("http://localhost:8000/api/auth/logout/", {}, { withCredentials: true }); } catch {}
    navigate("/login");
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSessions = sessions
    .filter((r) => {
      if (sessionFilter === "active") return r.is_active;
      if (sessionFilter === "ended")  return !r.is_active;
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
    const res = await fetch(
      `http://127.0.0.1:8000/api/session/accept/${id}/`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Failed");

    console.log("Accepted:", id);

    
    const pendingRes = await fetch(
      "http://127.0.0.1:8000/api/session/pending/",
      { credentials: "include" }
    );
    const pendingData = await pendingRes.json();
    setPendingSessions(pendingData);

  } catch (err) {
    console.error("Accept error:", err);
  }
};

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f0f1a", fontFamily: "'Inter', system-ui, sans-serif", color: "#e5e7eb" }}>

      
      <aside style={S.sidebar(collapsed)}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px", minHeight: "68px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          {!collapsed && (
            <div>
              <p style={{ color: "#f9fafb", fontSize: "14px", fontWeight: "600", margin: 0 }}>CareerNova</p>
              <p style={{ color: "#6366f1", fontSize: "11px", margin: 0, letterSpacing: "0.08em" }}>ADMIN PANEL</p>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {!collapsed && <p style={{ color: "#374151", fontSize: "10px", letterSpacing: "0.1em", fontWeight: "600", padding: "0 4px", marginBottom: "8px" }}>NAVIGATION</p>}
          {menuItems.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} style={S.navBtn(tab === item.key)}
              onMouseEnter={(e) => { if (tab !== item.key) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#d1d5db"; }}}
              onMouseLeave={(e) => { if (tab !== item.key) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {item.label}
                  {/* Live badge for sessions */}
                  {item.key === "sessions" && activeSessions > 0 && (
                    <span style={{ background: "#22c55e", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "1px 7px", borderRadius: "20px", marginLeft: "6px" }}>
                      {activeSessions} live
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", background: "transparent", color: "#4b5563", fontSize: "13px", width: "100%", marginBottom: "4px" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#9ca3af"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#4b5563"}
          >
            {collapsed ? icons.expand : icons.collapse}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", background: "transparent", color: "#ef4444", fontSize: "13px", width: "100%" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {icons.logout}
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#111827" }}>

        
        <header style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#4b5563", fontSize: "13px" }}>Admin</span>
            <span style={{ color: "#374151" }}>/</span>
            <span style={{ fontSize: "13px", fontWeight: "500", color: "#e5e7eb" }}>{currentPage?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "20px", padding: "4px 12px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e" }}></div>
              <span style={{ fontSize: "12px", color: "#818cf8" }}>saniyasaleen2821</span>
            </div>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "600" }}>S</div>
          </div>
        </header>

        
        <main style={{ flex: 1, overflow: "auto", padding: "28px" }}>

          {loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
              <div style={{ width: "32px", height: "32px", border: "3px solid rgba(99,102,241,0.2)", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* STATS */}
          {tab === "stats" && stats && !loading && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                {[
                  { label: "Total users",    value: stats.total_users,           color: "#6366f1", icon: "👥", bg: "rgba(99,102,241,0.1)" },
                  { label: "Banned users",   value: stats.banned_users,          color: "#ef4444", icon: "🚫", bg: "rgba(239,68,68,0.1)" },
                  { label: "Interviews",     value: stats.total_interviews,      color: "#10b981", icon: "🎤", bg: "rgba(16,185,129,0.1)" },
                  { label: "Avg score",      value: `${stats.avg_score}%`,       color: "#f59e0b", icon: "📊", bg: "rgba(245,158,11,0.1)" },
                  { label: "New this week",  value: stats.new_users_this_week,   color: "#8b5cf6", icon: "✨", bg: "rgba(139,92,246,0.1)" },
                  { label: "Live sessions",  value: activeSessions,              color: "#22c55e", icon: "🎥", bg: "rgba(34,197,94,0.1)" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "16px", right: "16px", width: "40px", height: "40px", background: s.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{s.icon}</div>
                    <p style={{ fontSize: "11px", color: "#6b7280", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                    <p style={{ fontSize: "32px", fontWeight: "700", color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: "20px" }}>
                <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
                  <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 16px" }}>User growth this week</p>
                  <canvas ref={lineRef} height="180"></canvas>
                </div>
                <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
                  <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 16px" }}>Score distribution</p>
                  <canvas ref={barRef} height="180"></canvas>
                </div>
                <div style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
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
              </div>
            </div>
          )}

      {tab === "sessions" && !loading && (
        <div>

          
          {pendingSessions.length > 0 && (
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
          )}
        </div>
      )}

        </main>
      </div>
    </div>
  );
}

