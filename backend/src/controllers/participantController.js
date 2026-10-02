import { pool } from "../config/db.js";

const F = [
  "name",
  "email",
  "phone",
  "ksm",
  "hospital",
  "province",
  "fellowship",
  "period",
  "status",
];
const scope = (req) =>
  req.user.role === "admin" ? ["TRUE", []] : ["owner_id=$1", [req.user.id]];

export async function list(req, res) {
  let [where, params] = scope(req);
  const { status, ksm, q } = req.query;
  if (status) {
    params.push(status);
    where += ` AND status=$${params.length}`;
  }
  if (ksm) {
    params.push(ksm);
    where += ` AND ksm=$${params.length}`;
  }
  if (q) {
    params.push(`%${q}%`);
    where += ` AND (name ILIKE $${params.length} OR hospital ILIKE $${params.length} OR province ILIKE $${params.length})`;
  }
  res.json(
    (
      await pool.query(
        `SELECT * FROM participants WHERE ${where} ORDER BY created_at DESC`,
        params,
      )
    ).rows,
  );
}
export async function stats(req, res) {
  const [where, params] = scope(req);
  res.json(
    (
      await pool.query(
        `SELECT status, COUNT(*)::int AS total FROM participants WHERE ${where} GROUP BY status`,
        params,
      )
    ).rows,
  );
}
export async function create(req, res) {
  const b = req.body;
  const { rows } = await pool.query(
    `INSERT INTO participants(owner_id,${F.join(",")}) VALUES($1,${F.map((_, i) => `$${i + 2}`).join(",")}) RETURNING *`,
    [req.user.id, ...F.map((k) => b[k])],
  );
  res.status(201).json(rows[0]);
}
export async function update(req, res) {
  const [where, params] = scope(req);
  const sets = F.map((k, i) => `${k}=$${params.length + i + 1}`).join(",");
  const r = await pool.query(
    `UPDATE participants SET ${sets} WHERE id=$${params.length + F.length + 1} AND ${where} RETURNING *`,
    [...params, ...F.map((k) => req.body[k]), req.params.id],
  );
  r.rowCount
    ? res.json(r.rows[0])
    : res.status(404).json({ message: "Data tidak ditemukan" });
}
export async function remove(req, res) {
  const [where, params] = scope(req);
  const r = await pool.query(
    `DELETE FROM participants WHERE id=$${params.length + 1} AND ${where}`,
    [...params, req.params.id],
  );
  r.rowCount
    ? res.status(204).end()
    : res.status(404).json({ message: "Data tidak ditemukan" });
}
