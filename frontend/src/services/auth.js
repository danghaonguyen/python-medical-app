
import api from "./apiClient";

export async function registerUser(data) {
  return api.post("/auth/register", {
    username: data.username,
    email: data.email,
    password: data.password,
  });
}

export async function loginUser(data) {
  const response = await api.post("/auth/login", {
    email: data.email,
    password: data.password,
  });

  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("user_id", response.data.user_id);
  localStorage.setItem("username", response.data.username);

  return response;
}

export async function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
}

export function getUserId() {
  return localStorage.getItem("user_id");
}
