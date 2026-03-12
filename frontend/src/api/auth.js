const BASE_URL = "http://localhost:8000/api/auth";

// Register
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",   // ⭐ allow cookies
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw responseData;
  }

  return responseData;
};


// Login
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",   // ⭐ VERY IMPORTANT (stores cookie)
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw responseData;
  }

  // ❌ Do NOT store tokens in localStorage
  // Django already saved them in cookies

  return responseData;
};