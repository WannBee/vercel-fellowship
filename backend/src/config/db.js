import pg from "pg";
import "dotenv/config";

pg.types.setTypeParser(1082, (v) => v); // kolom DATE tetap berupa teks 'YYYY-MM-DD'

const raw = process.env.DATABASE_URL || "";
const cfg = {
  ssl: raw.includes("localhost") ? false : { rejectUnauthorized: false },
  max: 3,
  connectionTimeoutMillis: 8000, // gagal dengan pesan jelas, tidak menggantung
  idleTimeoutMillis: 10000,
};

if (process.env.DB_PASSWORD) {
  // Password dibaca dari variabel sendiri (tidak perlu di-encode)
  const u = new URL(raw);
  Object.assign(cfg, {
    host: u.hostname,
    port: Number(u.port) || 5432,
    user: decodeURIComponent(u.username),
    database: u.pathname.slice(1) || "postgres",
    password: process.env.DB_PASSWORD,
  });
} else {
  cfg.connectionString = raw;
}

export const pool = new pg.Pool(cfg);
pool.on("error", (e) =>
  console.error("Kesalahan koneksi database:", e.message),
);
