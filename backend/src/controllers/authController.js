import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const sign = (u) =>
  jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
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
  if (!u || !(await bcrypt.compare(password, u.password)))
    return res.status(401).json({ message: "Email atau password salah" });
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
