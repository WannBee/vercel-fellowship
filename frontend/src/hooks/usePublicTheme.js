import { useLayoutEffect, useState } from "react";

const KEY = "theme";
const initial = () => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved === "dark";
  } catch {
    /* abaikan */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

// Dark mode khusus halaman publik. Kelas dilepas saat halaman ditinggalkan, jadi dashboard selalu terang.
export default function usePublicTheme() {
  const [dark, setDark] = useState(initial);
  useLayoutEffect(() => {
    // sebelum tampil di layar, agar tidak berkedip
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const toggle = () =>
    setDark((d) => {
      try {
        localStorage.setItem(KEY, d ? "light" : "dark");
      } catch {
        /* abaikan */
      }
      return !d;
    });
  return { dark, toggle };
}
