import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/profile/", { withCredentials: true })
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
      setImagePreview(URL.createObjectURL(file));
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
      })
      .catch(() => toast.error("Update Failed"))
      .finally(() => setLoading(false));
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-start">

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4">

          {/* Avatar Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Cover photo */}
            <div className="h-28 bg-gradient-to-br from-indigo-500 to-violet-600 relative">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
              />
            </div>

            <div className="px-5 pb-5 -mt-12 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={
                    imagePreview
                      ? imagePreview
                      : profile.image
                      ? `http://localhost:8000${profile.image}`
                      : `https://ui-avatars.com/api/?name=${profile.username || "User"}&background=6366f1&color=fff&size=200`
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center cursor-pointer shadow-md transition-colors">
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <h2 className="text-lg font-bold text-gray-900">{profile.username || "—"}</h2>
              <p className="text-sm text-gray-400 mt-0.5 mb-4">{profile.email || "—"}</p>

              <button
                onClick={() => setEditing(!editing)}
                className="w-full py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-100 hover:-translate-y-0.5 hover:shadow-indigo-200 transition-all duration-200"
              >
                {editing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* About Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">About me</h3>
            {editing ? (
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                rows={4}
                placeholder="Write something about yourself..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none transition"
              />
            ) : (
              <p className="text-sm text-gray-500 leading-relaxed">
                {profile.bio || "No bio added yet. Click Edit Profile to add one."}
              </p>
            )}

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["Resume Review", "AI Interview", "Career Growth"].map((tag) => (
                <span key={tag} className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Contact Info</h3>

            <div className="space-y-3">
              {/* Phone */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                {editing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleChange}
                    placeholder="Enter phone"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <svg className="w-3 h-3 fill-indigo-500" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{profile.phone || "Not set"}</span>
                  </div>
                )}
              </div>

              {/* City */}
              <div>
                <p className="text-xs text-gray-400 mb-1">City</p>
                {editing ? (
                  <input
                    type="text"
                    name="city"
                    value={profile.city || ""}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <svg className="w-3 h-3 fill-indigo-500" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{profile.city || "Not set"}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Address</p>
                {editing ? (
                  <input
                    type="text"
                    name="address"
                    value={profile.address || ""}
                    onChange={handleChange}
                    placeholder="Enter address"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <svg className="w-3 h-3 fill-indigo-500" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{profile.address || "Not set"}</span>
                  </div>
                )}
              </div>

              {/* Country */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Country</p>
                {editing ? (
                  <input
                    type="text"
                    name="country"
                    value={profile.country || ""}
                    onChange={handleChange}
                    placeholder="Enter country"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <svg className="w-3 h-3 fill-indigo-500" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{profile.country || "Not set"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Interviews Done", value: "12", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Resume Score", value: "87%", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { label: "Jobs Applied", value: "5", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 stroke-indigo-500" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Account Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Account Information</h3>
                <p className="text-xs text-gray-400 mt-0.5">Your login credentials</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">Username</p>
                <p className="text-sm font-semibold text-gray-800">{profile.username || "—"}</p>
              </div>
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">Email Address</p>
                <p className="text-sm font-semibold text-gray-800">{profile.email || "—"}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: "Completed AI Mock Interview", role: "Frontend Developer", time: "2 days ago", color: "bg-indigo-500" },
                { action: "Resume Uploaded & Analyzed", role: "ATS Score: 87%", time: "5 days ago", color: "bg-violet-500" },
                { action: "Profile Created", role: "Welcome to CareerNova!", time: "1 week ago", color: "bg-emerald-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.color}`} />
                  <div className="flex-1 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.action}</p>
                      <p className="text-xs text-gray-400">{item.role}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-4">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button — only show when editing */}
          {editing && (
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 flex items-center justify-between">
              <p className="text-sm text-gray-500">You have unsaved changes</p>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </>
                ) : "Save Changes"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
    </>
  );
}

export default Profile;