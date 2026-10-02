import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${location.hostname}:4000`,
});
API.interceptors.request.use((c) => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
API.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401 && !location.pathname.startsWith("/login")) {
      localStorage.clear();
      location.href = "/login";
    }
    return Promise.reject(e);
  },
);
export const errMsg = (e, d = "Terjadi kesalahan") =>
  e.response?.data?.message || d;
export default API;
