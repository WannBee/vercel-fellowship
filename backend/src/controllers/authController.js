import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const MAX_ATTEMPTS = 5;

const sign = (u) =>
  jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.SESSION_TTL || "135m",
  });
const pub = ({ password, ...u }) => u;

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Data tidak lengkap" });
  const dup = await pool.query("SELECT 1 FROM users WHERE email=$1", [email]);
  if (dup.rowCount)
    return res.status(409).json({ message: "Email sudah terdaftar" });
  const {
    rows: [{ count }],
  } = await pool.query("SELECT COUNT(*)::int FROM users");
  const {
    rows: [u],
  } = await pool.query(
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *",
    [
      name,
      email,
      await bcrypt.hash(password, 10),
      count === 0 ? "admin" : "user",
    ],
  );
  res.status(201).json({ token: sign(u), user: pub(u) });
}
export async function login(req, res) {
  const { email, password } = req.body;
  const {
    rows: [u],
  } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  if (u?.locked_until && new Date(u.locked_until) > new Date()) {
    const mins = Math.ceil((new Date(u.locked_until) - Date.now()) / 60000);
    return res.status(429).json({
      message: `Terlalu banyak percobaan gagal. Coba lagi dalam ${mins} menit.`,
    });
  }

  const ok = u && (await bcrypt.compare(password || "", u.password));
  if (!ok) {
    if (u) {
      await pool.query(
        `UPDATE users SET
           locked_until = CASE WHEN failed_attempts + 1 >= $2 THEN now() + interval '15 minutes' ELSE locked_until END,
           failed_attempts = CASE WHEN failed_attempts + 1 >= $2 THEN 0 ELSE failed_attempts + 1 END
         WHERE id=$1`,
        [u.id, MAX_ATTEMPTS],
      );
    }
    return res.status(401).json({ message: "Email atau password salah" });
  }

  await pool.query(
    "UPDATE users SET failed_attempts=0, locked_until=NULL WHERE id=$1",
    [u.id],
  );
  res.json({ token: sign(u), user: pub(u) });
}
export async function me(req, res) {
  const {
    rows: [u],
  } = await pool.query("SELECT id,name,email,role FROM users WHERE id=$1", [
    req.user.id,
  ]);
  res.json(u);
}
