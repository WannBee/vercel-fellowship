import axios from "axios";

// Produksi wajib memakai VITE_API_URL. Fallback hanya untuk development lokal/jaringan lokal.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? `http://${location.hostname}:4000` : "");

if (!baseURL && !import.meta.env.DEV)
  console.error("VITE_API_URL belum diisi saat build");

const API = axios.create({ baseURL });

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
