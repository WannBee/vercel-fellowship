const COLS = [
  ["name", "Nama"],
  ["email", "Email"],
  ["phone", "Telepon"],
  ["ksm", "KSM/Instalasi"],
  ["fellowship", "Fellowship"],
  ["hospital", "Asal RS"],
  ["province", "Provinsi"],
  ["period", "Periode"],
  ["status", "Status"],
];
export function exportCsv(rows, filename = "partisipan.csv") {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    COLS.map((c) => esc(c[1])).join(","),
    ...rows.map((r) => COLS.map((c) => esc(r[c[0]])).join(",")),
  ].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }),
  );
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
