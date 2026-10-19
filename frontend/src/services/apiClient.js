import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});


// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

export default api;