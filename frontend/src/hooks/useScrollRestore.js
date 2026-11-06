import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

let firstRun = true;

// Mengembalikan posisi scroll saat pengguna kembali (tombol Kembali) ke halaman ini.
// `ready` = isi halaman sudah termuat, agar tinggi halaman sudah mendekati yang semula.
export default function useScrollRestore(ready = true) {
  const { pathname, search } = useLocation();
  const navType = useNavigationType();
  const key = `scroll:${pathname}${search}`;
  const done = useRef(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history)
      window.history.scrollRestoration = "manual";
    let t;
    const save = () => sessionStorage.setItem(key, String(window.scrollY));
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(save, 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", save, true); // simpan tepat sebelum berpindah halaman
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", save, true);
      clearTimeout(t);
    };
  }, [key]);

  useEffect(() => {
    if (!ready || done.current) return;
    done.current = true;
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    const typedUrl = firstRun && nav?.type === "navigate"; // dibuka lewat alamat baru: jangan dipulihkan
    firstRun = false;
    if (navType !== "POP" || typedUrl) return;
    const target = Number(sessionStorage.getItem(key)) || 0;
    if (!target) return;

    let stopped = false;
    const stop = () => {
      stopped = true;
    };
    const events = ["wheel", "touchstart", "keydown", "mousedown"];
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    const started = Date.now();
    const id = setInterval(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (stopped || Date.now() - started > 3000) return clearInterval(id);
      window.scrollTo(0, Math.min(target, max));
      if (max >= target) clearInterval(id); // sudah sampai
    }, 100);
    return () => {
      clearInterval(id);
      events.forEach((e) => window.removeEventListener(e, stop));
    };
  }, [ready, key, navType]);
}
