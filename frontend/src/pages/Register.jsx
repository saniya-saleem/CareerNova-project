// import { useState } from "react";
// import { registerUser } from "../api/auth";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     name: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = await registerUser(form);

//     console.log(data);

//     if (!data.error) {
//       alert("Registered successfully");
//       navigate("/login");
//     } else {
//       alert("Register failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <form onSubmit={handleSubmit} className="space-y-4 w-80">
//         <input
//           placeholder="Name"
//           className="border p-2 w-full"
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />

//         <input
//           placeholder="Email"
//           className="border p-2 w-full"
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />

//         <input
//           placeholder="Password"
//           type="password"
//           className="border p-2 w-full"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />

//         <button className="bg-indigo-600 text-white p-2 w-full">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await registerUser(form);
    console.log(data);

    if (data.message) {
      alert("Registration success");
      navigate("/login");
    } else {
      alert(JSON.stringify(data));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        
        <input
          placeholder="Username"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-indigo-600 text-white p-2 w-full">
          Register
        </button>
      </form>
    </div>
  );
}