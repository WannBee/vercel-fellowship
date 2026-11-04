import { KSM, FELLOWSHIP, FUNDING } from "../constants/options";
import { TEMPLATE_HEADERS } from "./importParse";

const COLS = [
  ["name", "Nama", 28],
  ["ksm", "KSM/Instalasi", 28],
  ["fellowship", "Jenis Fellowship", 34],
  ["hospital", "Asal Rumah Sakit", 28],
  ["province", "Provinsi", 20],
  ["funding", "Sumber Biaya", 18],
  ["period_start", "Periode Mulai", 14],
  ["period_end", "Periode Selesai", 14],
  ["status", "Status", 22],
];
const cell = (v) => ({ type: String, value: String(v ?? "") });
const head = (labels) =>
  labels.map((l) => ({ type: String, value: l, fontWeight: "bold" }));

async function save(data, fileName) {
  const { default: writeXlsxFile } = await import("write-excel-file"); // dimuat hanya saat dipakai
  await writeXlsxFile(data, {
    columns: COLS.map(([, , width]) => ({ width })),
    fileName,
  });
}

export const exportXlsx = (rows, fileName = "peserta-fellowship.xlsx") =>
  save(
    [
      head(COLS.map((c) => c[1])),
      ...rows.map((r) => COLS.map(([k]) => cell(r[k]))),
    ],
    fileName,
  );

// Template kosong berisi satu baris contoh yang valid
export const downloadTemplate = () =>
  save(
    [
      head(TEMPLATE_HEADERS),
      [
        "Dr. Contoh, Sp.A",
        KSM[0],
        "RSUD Contoh",
        "Jawa Timur",
        FELLOWSHIP[0],
        FUNDING[0],
        "2026-07-01",
        "2027-06-30",
        "akan pendidikan",
      ].map(cell),
    ],
    "template-import-peserta.xlsx",
  );
