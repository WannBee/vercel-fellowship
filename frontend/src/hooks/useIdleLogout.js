import { useCallback, useEffect, useRef, useState } from "react";
import API from "../services/api";

const IDLE_MS = 2 * 60 * 60 * 1000; // batas tidak aktif: 2 jam (ubah angka ini)
const WARN_MS = 60 * 1000; // popup peringatan muncul 1 menit sebelum logout
const PING_MS = 5 * 60 * 1000; // selama aktif, perpanjang token di server tiap 5 menit
const KEY = "lastActivity";
const EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

// Mengembalikan { warning, stay }: warning = sisa detik (atau null), stay = fungsi untuk memperpanjang sesi
export default function useIdleLogout(enabled, onTimeout) {
  const cb = useRef(onTimeout);
  cb.current = onTimeout;
  const [warning, setWarning] = useState(null);
  const warnRef = useRef(false);
  const lastPing = useRef(Date.now());
  const touch = useCallback(
    () => localStorage.setItem(KEY, String(Date.now())),
    [],
  );

  const stay = useCallback(() => {
    warnRef.current = false;
    setWarning(null);
    touch();
    lastPing.current = Date.now();
    API.post("/api/auth/ping").catch(() => {});
  }, [touch]);

  useEffect(() => {
    if (!enabled) {
      warnRef.current = false;
      setWarning(null);
      return;
    }
    const idleFor = () =>
      Date.now() - (Number(localStorage.getItem(KEY)) || Date.now());
    const timeout = () => {
      sessionStorage.setItem("expired", "1");
      cb.current();
    };

    if (idleFor() > IDLE_MS) {
      timeout();
      return;
    } // browser dibuka lagi setelah lewat batas

    let lastWrite = 0;
    const onActivity = () => {
      if (warnRef.current) return; // saat peringatan tampil, hanya tombol "Tetap Masuk" yang memperpanjang sesi
      const t = Date.now();
      if (t - lastWrite > 5000) {
        lastWrite = t;
        touch();
      }
      if (t - lastPing.current > PING_MS) {
        lastPing.current = t;
        API.post("/api/auth/ping").catch(() => {});
      }
    };
    const check = () => {
      const remaining = IDLE_MS - idleFor();
      if (remaining <= 0) return timeout();
      if (remaining <= WARN_MS) {
        warnRef.current = true;
        setWarning(Math.ceil(remaining / 1000));
      } else if (warnRef.current) {
        warnRef.current = false;
        setWarning(null);
      } // diperpanjang dari tab lain
    };

    onActivity();
    EVENTS.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true }),
    );
    document.addEventListener("visibilitychange", check);
    const id = setInterval(check, 1000);
    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener("visibilitychange", check);
      clearInterval(id);
    };
  }, [enabled, touch]);

  return { warning, stay };
}
