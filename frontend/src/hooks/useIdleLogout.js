import { useEffect, useRef } from "react";
import API from "../services/api";

const IDLE_MS = 2 * 60 * 60 * 1000; // batas tidak aktif: 2 jam (ubah angka ini, mis. 1 * 60 * 60 * 1000 untuk 1 jam)
const PING_MS = 5 * 60 * 1000; // selama pengguna aktif, perpanjang token di server tiap 5 menit
const KEY = "lastActivity";
const EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

export default function useIdleLogout(enabled, onTimeout) {
  const cb = useRef(onTimeout);
  cb.current = onTimeout;

  useEffect(() => {
    if (!enabled) return;

    const expired = () =>
      Date.now() - (Number(localStorage.getItem(KEY)) || Date.now()) > IDLE_MS;
    const timeout = () => {
      sessionStorage.setItem("expired", "1");
      cb.current();
    };

    // Kasus browser ditutup lalu dibuka lagi setelah lebih dari batas waktu
    if (expired()) {
      timeout();
      return;
    }

    let lastWrite = 0;
    let lastPing = Date.now();
    const onActivity = () => {
      const t = Date.now();
      if (t - lastWrite > 5000) {
        lastWrite = t;
        localStorage.setItem(KEY, String(t));
      } // dibatasi agar ringan
      if (t - lastPing > PING_MS) {
        lastPing = t;
        API.post("/api/auth/ping").catch(() => {});
      }
    };
    const check = () => {
      if (expired()) timeout();
    };

    onActivity();
    EVENTS.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true }),
    );
    document.addEventListener("visibilitychange", check); // cek saat tab dibuka kembali
    const id = setInterval(check, 30000);

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener("visibilitychange", check);
      clearInterval(id);
    };
  }, [enabled]);
}
