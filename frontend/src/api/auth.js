// // const BASE_URL = "http://127.0.0.1:8000/api/auth";

// // // REGISTER
// // export const registerUser = async (data) => {
// //   const res = await fetch(`${BASE_URL}/register/`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(data),
// //   });
// //   return res.json();
// // };

// // // LOGIN
// // export const loginUser = async (data) => {
// //   const res = await fetch(`${BASE_URL}/login/`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(data),
// //   });
// //   return res.json();
// // };


// import axios from "axios";

// const API = "http://127.0.0.1:8000/api/auth";

// // REGISTER
// export const registerUser = async (form) => {
//   try {
//     const res = await axios.post(`${API}/register/`, form);
//     return res.data;
//   } catch (err) {
//     return err.response?.data || { error: "Register failed" };
//   }
// };

// // LOGIN
// export const loginUser = async (form) => {
//   try {
//     const res = await axios.post(`${API}/login/`, form);
//     return res.data;
//   } catch (err) {
//     return err.response?.data || { error: "Login failed" };
//   }
// };


const BASE_URL = "http://127.0.0.1:8000/api/auth";

// REGISTER
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// LOGIN
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

