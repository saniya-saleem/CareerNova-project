const BASE_URL = "http://127.0.0.1:8000/api/auth";


export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw responseData;
  }

  return responseData;
};



export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw responseData;
  }

  return responseData;
};