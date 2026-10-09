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
const neutral = {
  50: "#f6f9f9",
  100: "#eef3f3",
  200: "#dde6e6",
  300: "#c3d1d1",
  400: "#8fa3a4",
  500: "#667c7e",
  600: "#4b6062",
  700: "#384a4c",
  800: "#243436",
  900: "#15262a",
  950: "#0b171a",
};

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        indigo: brand, // warna utama (tombol, sidebar aktif, fokus)
        purple: brand, // aksen lama → turquoise juga, jadi gradien tidak lagi dua warna
        emerald: accent, // hijau terang (status Telah Lulus)
        blue: neutral, // dulu biru → abu-abu nuansa teal
        slate: neutral, // warna netral seluruh halaman
      },
    },
  },
  plugins: [],
};
