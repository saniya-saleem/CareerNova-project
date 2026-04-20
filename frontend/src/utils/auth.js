import axios from "axios";

export function getAccessToken() {
  return null;
}

export function getAuthHeaders(extraHeaders = {}) {
  return extraHeaders;
}

export function persistAuthSession() {
  return null;
}

export function clearAuthSession() {
  return null;
}                                               

export async function fetchCurrentUser() {
  const res = await axios.get("http://localhost:8000/api/auth/user-info/", {
    withCredentials: true,
  });
  return res.data;
}
