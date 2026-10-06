import pg from "pg";
import "dotenv/config";
pg.types.setTypeParser(1082, (v) => v);

const raw = process.env.DATABASE_URL || "";
const cfg = {
  ssl: raw.includes("localhost") ? false : { rejectUnauthorized: false },
  max: 3,
  connectionTimeoutMillis: 8000, // gagal setelah 8 detik, tidak menggantung
  idleTimeoutMillis: 10000,
};

if (process.env.DB_PASSWORD) {
  // Password dibaca dari variabel sendiri, jadi karakter khusus aman dan tidak perlu di-encode
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
