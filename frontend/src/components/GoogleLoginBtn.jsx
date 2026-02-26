import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleLoginBtn() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/google/",
        {
          access_token: credentialResponse.credential, // ✅ keep same
        }
      );

      console.log(res.data);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // ✅ redirect only
      navigate("/");

    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Google login failed")}
    />
  );
}

// import { useState } from "react";
// import { loginUser } from "../api/auth";
// import GoogleLoginBtn from "../components/GoogleLoginBtn";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = await loginUser(form);
//     console.log(data);

//     if (data.access) {
//       localStorage.setItem("access", data.access);
//       localStorage.setItem("refresh", data.refresh);
//       alert("Login success");
//       navigate("/");
//     } else {
//       alert(JSON.stringify(data));
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <form onSubmit={handleSubmit} className="space-y-4 w-80">

//         <input
//           placeholder="Username"
//           className="border p-2 w-full"
//           onChange={(e) => setForm({ ...form, username: e.target.value })}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 w-full"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />

//         <button className="bg-indigo-600 text-white p-2 w-full">
//           Login
//         </button>

//         <GoogleLoginBtn />
//       </form>
//     </div>
//   );
// }