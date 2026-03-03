import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // ✅ FIXED

  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Image Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfile({
        ...profile,
        image: file,
      });

      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Use FormData for image upload
  const handleSubmit = () => {
    setLoading(true);

    const formData = new FormData();

    Object.keys(profile).forEach((key) => {
      formData.append(key, profile[key]);
    });

    axios
      .patch("http://127.0.0.1:8000/api/profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setProfile(res.data);
        toast.success("Profile Updated Successfully");
      })
      .catch(() => toast.error("Update Failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">

        {/* Header Section */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  imagePreview
                    ? imagePreview
                    : profile.image
                    ? `http://127.0.0.1:8000${profile.image}`
                    : `https://ui-avatars.com/api/?name=${profile.username || "User"}`
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />

              <label className="absolute bottom-0 right-0 bg-black text-white text-xs px-2 py-1 rounded cursor-pointer">
                Edit
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.username}
              </h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded-md text-sm hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Body Section */}
        <div className="p-6 grid md:grid-cols-2 gap-8">

          <div>
            <p className="text-sm text-gray-500 mb-1">Phone</p>
            <input
              type="text"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-black outline-none"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">City</p>
            <input
              type="text"
              name="city"
              value={profile.city || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-black outline-none"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Address</p>
            <input
              type="text"
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-black outline-none"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Country</p>
            <input
              type="text"
              name="country"
              value={profile.country || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-black outline-none"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile; 