import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { FileText, Activity, BarChart3, ArrowUpRight, Clock, Star } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: "Resumes Analyzed", value: "12", trend: "+2 this week", icon: <FileText className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { title: "Mock Interviews", value: "5", trend: "+1 this week", icon: <Activity className="w-5 h-5" />, color: "text-primary-500", bg: "bg-primary-50 dark:bg-primary-500/10" },
    { title: "Average Score", value: "82%", trend: "+5% improvement", icon: <Star className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  ];

  const quickActions = [
    {
      title: "Resume Analyzer",
      desc: "Upload resume & get an instant AI ATS score.",
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      path: "/resume-upload",
      gradient: "from-indigo-500/10 to-indigo-500/5",
      border: "hover:border-indigo-500/50"
    },
    {
      title: "AI Mock Interview",
      desc: "Practice with an AI trained on real interviews.",
      icon: <Activity className="w-6 h-6 text-violet-500" />,
      path: "/mock-interview",
      gradient: "from-violet-500/10 to-violet-500/5",
      border: "hover:border-violet-500/50"
    },
    {
      title: "Performance Analytics",
      desc: "View detailed performance insights and trends.",
      icon: <BarChart3 className="w-6 h-6 text-pink-500" />,
      path: "/analytics",
      gradient: "from-pink-500/10 to-pink-500/5",
      border: "hover:border-pink-500/50"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Welcome back, User</h1>
            <p className="text-[var(--text-muted)] mt-1 text-sm md:text-base">Here is your career progression overview.</p>
          </div>
          <button 
            onClick={() => navigate("/resume-upload")}
            className="btn-primary"
          >
            New Analysis
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className="card-base group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">{stat.title}</p>
                  <h2 className="text-3xl font-bold text-[var(--text-main)] mt-2 mb-1">{stat.value}</h2>
                  <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                onClick={() => navigate(action.path)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${action.gradient} border border-[var(--border-main)] ${action.border} shadow-sm group`}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center shadow-sm mb-5 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <h3 className="font-bold text-lg text-[var(--text-main)] mb-2">{action.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {action.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Recent Activity Placeholder */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-6">Recent Activity</h2>
          <div className="card-base">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-[var(--bg-main)] rounded-full flex items-center justify-center mb-4">
                 <Clock className="w-6 h-6 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-[var(--text-main)] font-semibold mb-1">No recent activity</h3>
              <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto">Upload a resume or start an interview to populate your activity feed.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}