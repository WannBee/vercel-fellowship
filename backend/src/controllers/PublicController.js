import { pool } from "../config/db.js";

const COLS =
  "id, name, email, phone, ksm, fellowship, hospital, province, funding, period_start, period_end, status";
const PER_PAGE = 10;

export async function list(req, res) {
  const { status, ksm, q } = req.query;
  const params = [];
  let where = "TRUE";
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
    const n = params.length;
    where += ` AND (name ILIKE $${n} OR email ILIKE $${n} OR hospital ILIKE $${n} OR province ILIKE $${n} OR fellowship ILIKE $${n} OR funding ILIKE $${n})`;
  }
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const total = (
    await pool.query(
      `SELECT COUNT(*)::int AS n FROM participants WHERE ${where}`,
      params,
    )
  ).rows[0].n;
  params.push(PER_PAGE, (page - 1) * PER_PAGE);
  const rows = (
    await pool.query(
      `SELECT ${COLS} FROM participants WHERE ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    )
  ).rows;
  res.json({
    rows,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / PER_PAGE)),
  });
}

export async function stats(_req, res) {
  const { rows } = await pool.query(
    "SELECT status, COUNT(*)::int AS total FROM participants GROUP BY status",
  );
  const out = { total: 0 };
  for (const r of rows) {
    out[r.status] = r.total;
    out.total += r.total;
  }
  res.json(out);
}
