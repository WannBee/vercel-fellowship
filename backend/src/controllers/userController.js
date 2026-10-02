import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

export const list = async (_q, res) =>
  res.json(
    (
      await pool.query(
        "SELECT id,name,email,role,created_at FROM users ORDER BY created_at",
      )
    ).rows,
  );

export async function updateRole(req, res) {
  if (!["admin", "user"].includes(req.body.role))
    return res.status(400).json({ message: "Role tidak valid" });
  const r = await pool.query(
    "UPDATE users SET role=$1 WHERE id=$2 RETURNING id,name,email,role",
    [req.body.role, req.params.id],
  );
  r.rowCount
    ? res.json(r.rows[0])
    : res.status(404).json({ message: "User tidak ditemukan" });
}

export async function updateProfile(req, res) {
  const r = await pool.query(
    "UPDATE users SET name=$1 WHERE id=$2 RETURNING id,name,email,role",
    [req.body.name, req.user.id],
  );
  res.json(r.rows[0]);
}

// Admin: edit nama, email, role, dan (opsional) password user mana pun
export async function updateUser(req, res) {
  const { name, email, password, role } = req.body;
  const { id } = req.params;

  if (!name?.trim())
    return res.status(400).json({ message: "Nama wajib diisi" });
  if (!/^\S+@\S+\.\S+$/.test(email || ""))
    return res.status(400).json({ message: "Format email tidak valid" });
  if (role && !["admin", "user"].includes(role))
    return res.status(400).json({ message: "Role tidak valid" });
  if (password && password.length < 6)
    return res.status(400).json({ message: "Password minimal 6 karakter" });
  if (id === req.user.id && role && role !== "admin")
    return res
      .status(400)
      .json({ message: "Tidak bisa menurunkan role akun sendiri" });

  const dup = await pool.query(
    "SELECT 1 FROM users WHERE email=$1 AND id<>$2",
    [email.trim(), id],
  );
  if (dup.rowCount)
    return res.status(409).json({ message: "Email sudah dipakai user lain" });

  const sets = ["name=$1", "email=$2"];
  const vals = [name.trim(), email.trim()];
  if (role) {
    vals.push(role);
    sets.push(`role=$${vals.length}`);
  }
  if (password) {
    vals.push(await bcrypt.hash(password, 10));
    sets.push(`password=$${vals.length}`);
  }
  vals.push(id);

  const r = await pool.query(
    `UPDATE users SET ${sets.join(",")} WHERE id=$${vals.length} RETURNING id,name,email,role`,
    vals,
  );
  r.rowCount
    ? res.json(r.rows[0])
    : res.status(404).json({ message: "User tidak ditemukan" });
}

// Admin: hapus user (data partisipan miliknya ikut terhapus karena ON DELETE CASCADE)
export async function removeUser(req, res) {
  if (req.params.id === req.user.id)
    return res
      .status(400)
      .json({ message: "Tidak bisa menghapus akun sendiri" });
  const r = await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
  r.rowCount
    ? res.status(204).end()
    : res.status(404).json({ message: "User tidak ditemukan" });
}
