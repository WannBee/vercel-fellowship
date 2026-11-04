import {
  KSM,
  FELLOWSHIP,
  FUNDING,
  PROVINCES,
  STATUS,
  STATUS_LABEL,
} from "../constants/options";

export const TEMPLATE_HEADERS = [
  "Nama",
  "KSM/Instalasi",
  "Asal Rumah Sakit",
  "Provinsi",
  "Jenis Fellowship",
  "Sumber Biaya",
  "Periode Mulai",
  "Periode Selesai",
  "Status",
];

const squash = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
const key = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
const pad = (n) => String(n).padStart(2, "0");

// Nama kolom yang diterima (setelah huruf kecil dan tanda baca dibuang)
const HEADER_MAP = {
  name: ["nama", "namalengkap", "namapeserta", "name"],
  ksm: ["ksm", "ksminstalasi", "instalasi"],
  hospital: ["asalrumahsakit", "asalrs", "rumahsakit", "hospital"],
  province: ["provinsi", "province"],
  fellowship: ["jenisfellowship", "fellowship"],
  funding: ["sumberbiaya", "jenispembiayaan", "pembiayaan", "biaya", "funding"],
  period_start: ["periodemulai", "mulai", "tanggalmulai", "start"],
  period_end: ["periodeselesai", "selesai", "tanggalselesai", "end"],
  status: ["status", "statuspelatihan"],
};
const FIELD_LABEL = {
  name: "Nama",
  ksm: "KSM/Instalasi",
  hospital: "Asal Rumah Sakit",
  province: "Provinsi",
  fellowship: "Jenis Fellowship",
  funding: "Sumber Biaya",
  period_start: "Periode Mulai",
  period_end: "Periode Selesai",
  status: "Status",
};

// Pembaca CSV sederhana. Pemisah (koma, titik koma, atau tab) dideteksi otomatis,
// karena Excel berbahasa Indonesia biasanya menyimpan CSV dengan titik koma.
export function parseCsv(text) {
  const src = text.replace(/^\uFEFF/, "");
  const first = src.split(/\r?\n/, 1)[0] || "";
  const delim = [";", "\t", ","]
    .map((d) => [d, first.split(d).length])
    .sort((a, b) => b[1] - a[1])[0][0];
  const rows = [];
  let row = [],
    cell = "",
    quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === delim) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const ymd = (d) =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const validYmd = (y, m, d) => {
  const dt = new Date(Date.UTC(+y, +m - 1, +d));
  return dt.getUTCFullYear() === +y &&
    dt.getUTCMonth() === +m - 1 &&
    dt.getUTCDate() === +d
    ? `${y}-${pad(m)}-${pad(d)}`
    : "";
};
// Menerima: tanggal Excel, angka seri Excel, YYYY-MM-DD, atau DD/MM/YYYY (hari/bulan/tahun)
export function toIsoDate(v) {
  const HALF = 12 * 3600000; // +12 jam agar zona waktu tidak menggeser tanggal
  if (v instanceof Date) return ymd(new Date(v.getTime() + HALF));
  if (typeof v === "number" && v > 20000 && v < 80000)
    return ymd(new Date(Math.round((v - 25569) * 86400000) + HALF));
  const s = String(v ?? "").trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return validYmd(m[1], m[2], m[3]);
  m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  return m ? validYmd(m[3], m[2], m[1]) : "";
}

const lookup = (list) => new Map(list.map((o) => [squash(o), o]));

// table = array of rows (baris pertama = judul kolom). Hasil: { rows: [{ line, data, errors }] } atau { error }
export function normalizeRows(table) {
  if (!table.length) return { error: "File kosong" };
  const header = table[0].map(key);
  const idx = Object.fromEntries(
    Object.entries(HEADER_MAP).map(([f, names]) => [
      f,
      header.findIndex((h) => names.includes(h)),
    ]),
  );
  const missing = Object.keys(idx)
    .filter((f) => idx[f] < 0)
    .map((f) => FIELD_LABEL[f]);
  if (missing.length)
    return {
      error: `Kolom tidak ditemukan: ${missing.join(", ")}. Gunakan template yang disediakan.`,
    };

  const ksmMap = lookup(KSM),
    fellowMap = lookup(FELLOWSHIP),
    fundMap = lookup(FUNDING);
  const provMap = new Map(PROVINCES.map((p) => [key(p), p]));
  const statusMap = new Map();
  STATUS.forEach((s) => {
    statusMap.set(squash(s), s);
    statusMap.set(squash(STATUS_LABEL[s]), s);
  });

  const rows = [];
  table.slice(1).forEach((cells, i) => {
    if (cells.every((c) => String(c ?? "").trim() === "")) return; // lewati baris kosong
    const get = (f) => cells[idx[f]];
    const text = (f) => String(get(f) ?? "").trim();
    const errors = [];
    const pick = (f, label, found) => {
      if (!found) errors.push(`${label} tidak dikenali: "${text(f)}"`);
      return found;
    };

    const name = text("name");
    if (!name) errors.push("Nama kosong");
    const hospital = text("hospital");
    if (!hospital) errors.push("Asal rumah sakit kosong");
    const start = toIsoDate(get("period_start"));
    if (!start)
      errors.push(
        "Periode mulai tidak valid (pakai YYYY-MM-DD atau DD/MM/YYYY)",
      );
    const end = toIsoDate(get("period_end"));
    if (!end) errors.push("Periode selesai tidak valid");
    if (start && end && end < start)
      errors.push("Periode selesai sebelum periode mulai");

    const data = {
      name,
      hospital,
      period_start: start,
      period_end: end,
      is_public: true,
      ksm: pick("ksm", "KSM", ksmMap.get(squash(get("ksm")))),
      fellowship: pick(
        "fellowship",
        "Fellowship",
        fellowMap.get(squash(get("fellowship"))),
      ),
      funding: pick(
        "funding",
        "Sumber biaya",
        fundMap.get(squash(get("funding"))),
      ),
      province: pick(
        "province",
        "Provinsi",
        provMap.get(key(get("province")).replace(/^provinsi/, "")),
      ),
      status: pick("status", "Status", statusMap.get(squash(get("status")))),
    };
    rows.push({ line: i + 2, data, errors });
  });
  return { rows };
}
