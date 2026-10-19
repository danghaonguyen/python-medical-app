import api from "./apiClient";

// Mọi request đi qua instance `api` (apiClient.js): baseURL = /api (proxy Vite),
// withCredentials = true để gửi kèm cookie session của Flask.

export async function registerUser(data) {
  return api.post("/auth/register", {
    username: data.username,
    email: data.email,
    password: data.password,
  });
}

export async function loginUser(data) {
  return api.post("/auth/login", {
    email: data.email,
    password: data.password,
  });
}

export async function logoutUser() {
  await api.post("/auth/logout");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

export function getUserId() {
  return localStorage.getItem("user_id");
}
