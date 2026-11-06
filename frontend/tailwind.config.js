const brand = {
  50: "#e8f8f9",
  100: "#c5eef0",
  200: "#92dde2",
  300: "#52c7d0",
  400: "#22b0bc",
  500: "#0a97a4",
  600: "#077d89",
  700: "#0a636d",
  800: "#0d4f58",
  900: "#0e424a",
  950: "#062b31",
};
const accent = {
  50: "#f3fae8",
  100: "#e2f3c6",
  200: "#c8e892",
  300: "#a8d95c",
  400: "#8cc63f",
  500: "#76b02f",
  600: "#5b9024",
  700: "#476f21",
  800: "#3b5a20",
  900: "#324c1f",
  950: "#1b2f0e",
};
// Skala netral memakai variabel CSS agar bisa dibalik untuk mode gelap (nilainya ada di index.css)
const neutral = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [
    n,
    `rgb(var(--n-${n}) / <alpha-value>)`,
  ]),
);

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        indigo: brand,
        purple: brand,
        emerald: accent,
        blue: neutral,
        slate: neutral,
      },
    },
  },
  plugins: [],
};
