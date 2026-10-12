import axios from "axios";

// Produksi wajib memakai VITE_API_URL. Fallback hanya untuk development lokal/jaringan lokal.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? `http://${location.hostname}:4000` : "");

const API = axios.create({ baseURL });

API.interceptors.request.use((c) => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

API.interceptors.response.use(
  (r) => {
    // Simpan token yang diperpanjang server (sliding session)
    const fresh = r.headers["x-new-token"];
    if (fresh) localStorage.setItem("token", fresh);
    return r;
  },
  (e) => {
    const publicPaths = ["/", "/login", "/register"];
    if (
      e.response?.status === 401 &&
      !publicPaths.includes(location.pathname)
    ) {
      ["token", "user", "lastActivity"].forEach((k) =>
        localStorage.removeItem(k),
      );
      sessionStorage.setItem("expired", "1");
      location.href = "/"; // sesi kedaluwarsa → landing page
    }
    return Promise.reject(e);
  },
);

export const errMsg = (e, d = "Terjadi kesalahan") =>
  e.response?.data?.message || d;
export default API;
