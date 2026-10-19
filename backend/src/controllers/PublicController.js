import { pool } from "../config/db.js";

const COLS = "id, name, status"; // hanya yang ditampilkan di halaman daftar
const PER_PAGE = 20;
const FILTERS = ["status", "funding", "ksm", "fellowship"]; // whitelist kolom penyaring

// GET /api/public/participants?status=...&funding=...&ksm=...&fellowship=...&page=1
export async function list(req, res) {
  const params = [];
  let where = "TRUE";
  for (const col of FILTERS) {
    const v = req.query[col];
    if (v) {
      params.push(String(v));
      where += ` AND ${col}=$${params.length}`;
    }
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
      `SELECT ${COLS} FROM participants WHERE ${where} ORDER BY name LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    )
  ).rows;
  res.json({
    rows,
    total,
    page,
    perPage: PER_PAGE,
    pages: Math.max(1, Math.ceil(total / PER_PAGE)),
  });
}

export async function stats(_req, res) {
  // nama kolom di bawah literal tetap (bukan input user), jadi aman
  const count = async (col) => {
    const { rows } = await pool.query(
      `SELECT ${col} AS k, COUNT(*)::int AS n FROM participants WHERE ${col} IS NOT NULL GROUP BY ${col}`,
    );
    return Object.fromEntries(rows.map((r) => [r.k, r.n]));
  };
  const [status, funding, ksm, fellowship, province] = await Promise.all([
    count("status"),
    count("funding"),
    count("ksm"),
    count("fellowship"),
    count("province"),
  ]);
  const total = Object.values(status).reduce((a, b) => a + b, 0);
  res.json({ total, status, funding, ksm, fellowship, province });
}

const GROUPS = {
  status: "status",
  funding: "funding",
  ksm: "ksm",
  fellowship: "fellowship",
};

// GET /api/public/yearly?group=status
export async function yearly(req, res) {
  const col = GROUPS[req.query.group] || "status"; // whitelist, bukan input mentah
  const { rows } = await pool.query(
    `SELECT EXTRACT(YEAR FROM period_start)::int AS year, ${col} AS k, COUNT(*)::int AS n
     FROM participants WHERE period_start IS NOT NULL AND ${col} IS NOT NULL
     GROUP BY 1, 2 ORDER BY 1`,
  );
  const byYear = {};
  for (const r of rows)
    (byYear[r.year] ??= { year: r.year, counts: {} }).counts[r.k] = r.n;
  res.json(Object.values(byYear));
}
