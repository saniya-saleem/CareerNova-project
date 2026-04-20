import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { Edit2, MapPin, Phone, CheckCircle2, XCircle, Save, Clock, Activity, Loader2, Camera, User } from "lucide-react";
import { motion } from "framer-motion";

function Profile() {
  const [profile, setProfile] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/profile/", { withCredentials: true })
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Failed to load profile"));

    setActivitiesLoading(true);
    axios
      .get("http://localhost:8000/api/profile/activities/", { withCredentials: true })
      .then((res) => setActivities(res.data))
      .catch(() => console.error("Failed to load activities")) 
      .finally(() => setActivitiesLoading(false));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
      setImagePreview(URL.createObjectURL(file));
      setEditing(true); 
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(profile).forEach((key) => formData.append(key, profile[key]));
    axios
      .patch("http://localhost:8000/api/profile/", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setProfile(res.data);
        setEditing(false);
        toast.success("Profile Updated Successfully");
       
        axios
          .get("http://localhost:8000/api/profile/activities/", { withCredentials: true })
          .then((res) => setActivities(res.data))
          .catch(() => {});
      })
      .catch(() => toast.error("Update Failed"))
      .finally(() => setLoading(false));
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const activityColors = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500", 
    "bg-amber-500", "bg-rose-500", "bg-cyan-500"
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Navbar />
      <Toaster position="top-center" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header with Save Button (Sticky on mobile) */}
        <div className="flex items-center justify-between mb-8 sticky top-20 z-40 bg-[var(--bg-main)]/90 backdrop-blur-md py-4 sm:static sm:bg-transparent">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Profile Settings</h1>
            <p className="text-[var(--text-muted)] mt-1">Manage your account and preferences.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            )}
            <button
              onClick={editing ? handleSubmit : () => setEditing(true)}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition-all duration-300 ${
                editing ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 active:scale-95" : "bg-primary-600 hover:bg-primary-700 shadow-primary-500/20 active:scale-95"
              } disabled:opacity-50`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          
          <div className="w-full lg:w-1/3 flex-shrink-0 flex flex-col gap-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
              className="card-base !p-0 overflow-hidden text-center"
            >
              {/* Cover Banner */}
              <div className="h-32 bg-gradient-to-br from-primary-500 to-violet-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e6/Graph-paper.svg')] mix-blend-overlay"></div>
              </div>

              {/* Avatar */}
              <div className="px-6 pb-6 -mt-16 flex flex-col items-center relative z-10">
                <div className="relative mb-4 group">
                  <img
                    src={
                      imagePreview
                        ? imagePreview
                        : profile.image
                        ? `http://localhost:8000${profile.image}`
                        : `https://ui-avatars.com/api/?name=${profile.username || "User"}&background=6366f1&color=fff&size=200`
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-[var(--bg-surface)] shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  {editing && (
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-600 text-white hover:bg-primary-700 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-primary-500/30 transition-all duration-200 hover:scale-110 border-2 border-[var(--bg-surface)]">
                      <Camera className="w-5 h-5" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">{profile.username || "Anonymous"}</h2>
                <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-sm mb-4">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online
                </div>

                {editing ? (
                  <textarea
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Write a short bio about your career stack..."
                    className="input-base text-sm resize-none mb-4 min-h-[80px]"
                  />
                ) : (
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 px-2">
                    {profile.bio || "Crafting code, learning, and accelerating towards the next big opportunity."}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Contact Information Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="card-base"
            >
              <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-primary-500" /> Contact Details
              </h3>
              
              <div className="space-y-4">
                <div className="group">
                  <p className="text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">Phone</p>
                  {editing ? (
                    <input type="text" name="phone" value={profile.phone || ""} onChange={handleChange} placeholder="+1 (555) 000-0000" className="input-base py-2 text-sm" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                        <Phone className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-main)]">{profile.phone || "Not specified"}</span>
                    </div>
                  )}
                </div>

                <div className="group">
                  <p className="text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">Location</p>
                  {editing ? (
                    <div className="space-y-2">
                      <input type="text" name="city" value={profile.city || ""} onChange={handleChange} placeholder="City (e.g., San Francisco)" className="input-base py-2 text-sm" />
                      <input type="text" name="country" value={profile.country || ""} onChange={handleChange} placeholder="Country" className="input-base py-2 text-sm" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                        <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-main)]">
                        {profile.city || profile.country ? `${profile.city || ""}${profile.city && profile.country ? ', ' : ''}${profile.country || ""}` : "Not specified"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Key Metrics & Activity */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
               {/* Account Status */}
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-base flex items-center justify-between !py-5 hover:border-emerald-500/30 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Account Status</p>
                    <p className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
                      Active <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </p>
                  </div>
               </motion.div>

               {/* Email Reference */}
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-base flex flex-col justify-center !py-5">
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Primary Email</p>
                  <p className="text-sm font-semibold text-[var(--text-main)] truncate">{profile.email || "—"}</p>
               </motion.div>
            </div>

            {/* Recent Activity Log */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="card-base flex-1 min-h-[400px]"
            >
              <div className="flex items-center justify-between mb-6 border-b border-[var(--border-main)] pb-4">
                <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-500" /> Recent Activity Log
                </h3>
              </div>

              {activitiesLoading ? (
                <div className="space-y-6 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-2.5 h-2.5 rounded-full mt-1.5 bg-[var(--border-main)]" />
                      <div className="w-full space-y-2">
                        <div className="h-4 bg-[var(--border-main)] rounded w-1/3"></div>
                        <div className="h-3 bg-[var(--border-main)]/50 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center h-full">
                  <div className="w-16 h-16 rounded-3xl bg-[var(--bg-main)] border border-[var(--border-main)] flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-[var(--text-muted)]" />
                  </div>
                  <h4 className="text-[var(--text-main)] font-semibold text-lg mb-1">Quiet around here</h4>
                  <p className="text-[var(--text-muted)] text-sm max-w-[250px]">Your platform actions, uploads, and interviews will be tracked right here.</p>
                </div>
              ) : (
                <div className="space-y-6 mt-4 relative before:absolute before:inset-0 before:ml-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border-main)] before:to-transparent">
                  {activities.map((item, i) => (
                    <div key={item.id ?? i} className="relative flex items-start gap-4 z-10">
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 shadow-sm border-2 border-[var(--bg-surface)] ${activityColors[i % activityColors.length]}`} />
                      <div className="flex-1 bg-[var(--bg-main)] hover:bg-[var(--border-main)]/30 border border-[var(--border-main)] p-4 rounded-xl transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <p className="text-sm font-semibold text-[var(--text-main)]">{item.action}</p>
                          <span className="text-xs font-medium text-[var(--text-muted)] whitespace-nowrap bg-[var(--bg-surface)] px-2 py-1 rounded-md border border-[var(--border-main)]">
                            {formatTime(item.created_at)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;