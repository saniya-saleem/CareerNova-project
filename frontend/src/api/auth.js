const BASE_URL = "http://localhost:8000/api/auth";
const ROOM_URL = "http://localhost:8000/api/chat";

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) throw responseData;
  return responseData;
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) throw responseData;
  return responseData;
};

// ─── Room ──────────────────────────────────────────────────────────────────────

export const createRoom = async () => {
  const res = await fetch(`${ROOM_URL}/rooms/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const joinRoom = async (code) => {
  const res = await fetch(`${ROOM_URL}/rooms/join/${code}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const closeRoom = async (code) => {
  const res = await fetch(`${ROOM_URL}/rooms/${code}/close/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};