import { useState } from "react";
import { X, Upload, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { parseCsv, normalizeRows } from "../utils/importParse";
import { downloadTemplate } from "../utils/exportXlsx";
import { errMsg } from "../services/api";

const MAX = 500;

export default function ImportModal({ onClose, onImport }) {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState(null); // null = belum ada file
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // agar file yang sama bisa dipilih lagi
    if (!file) return;
    setFileName(file.name);
    setError("");
    setRows(null);
    setDone(null);
    try {
      let table;
      if (/\.csv$/i.test(file.name)) table = parseCsv(await file.text());
      else if (/\.xlsx$/i.test(file.name)) {
        const { default: readXlsxFile } = await import("read-excel-file");
        table = await readXlsxFile(file);
      } else return setError("Format file harus .xlsx atau .csv");
      const r = normalizeRows(table);
      if (r.error) return setError(r.error);
      setRows(r.rows);
    } catch (x) {
      console.error(x);
      setError(
        "File tidak bisa dibaca. Pastikan formatnya benar dan file tidak rusak.",
      );
    }
  };

  const valid = rows?.filter((r) => !r.errors.length) || [];
  const invalid = rows?.filter((r) => r.errors.length) || [];
  const tooMany = valid.length > MAX;

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await onImport(valid.map((r) => r.data));
      setDone(r.inserted);
    } catch (x) {
      setError(errMsg(x));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-lg font-bold text-slate-800">
            Import Data Peserta
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {done !== null ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="text-lg font-bold text-slate-800 mt-3">
                {done} peserta berhasil diimpor
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Selesai
              </button>
            </div>
          ) : (
            <>
              <ol className="text-sm text-slate-600 space-y-1 list-decimal pl-5">
                <li>
                  Unduh template, lalu isi sesuai contoh. Nilai KSM, fellowship,
                  sumber biaya, provinsi, dan status harus sama dengan pilihan
                  di form.
                </li>
                <li>
                  Tanggal ditulis <b>YYYY-MM-DD</b> atau <b>DD/MM/YYYY</b>.
                  Maksimal {MAX} baris.
                </li>
                <li>
                  Unggah file .xlsx atau .csv, periksa pratinjau, lalu klik
                  Impor.
                </li>
              </ol>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    downloadTemplate().catch(() =>
                      setError("Template gagal dibuat"),
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Download className="w-4 h-4" />
                  Unduh Template
                </button>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Pilih File
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={pickFile}
                    className="hidden"
                  />
                </label>
                {fileName && (
                  <span className="self-center text-sm text-slate-500 truncate max-w-[14rem]">
                    {fileName}
                  </span>
                )}
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl">
                  {error}
                </div>
              )}

              {rows && (
                <>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                      {valid.length} baris valid
                    </span>
                    {invalid.length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-medium">
                        {invalid.length} baris bermasalah (dilewati)
                      </span>
                    )}
                  </div>

                  {invalid.length > 0 && (
                    <div className="border border-rose-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 text-sm font-semibold">
                        <AlertTriangle className="w-4 h-4" />
                        Baris yang dilewati
                      </div>
                      <ul className="divide-y divide-rose-100 max-h-40 overflow-y-auto text-sm">
                        {invalid.slice(0, 50).map((r) => (
                          <li key={r.line} className="px-4 py-2">
                            <b className="text-slate-700">Baris {r.line}:</b>{" "}
                            <span className="text-rose-600">
                              {r.errors.join("; ")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {valid.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                            {[
                              "Baris",
                              "Nama",
                              "KSM",
                              "Provinsi",
                              "Periode",
                              "Status",
                            ].map((h) => (
                              <th key={h} className="py-2 px-3 font-semibold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {valid.slice(0, 10).map((r) => (
                            <tr key={r.line}>
                              <td className="py-2 px-3 text-slate-400">
                                {r.line}
                              </td>
                              <td className="py-2 px-3 font-medium text-slate-800">
                                {r.data.name}
                              </td>
                              <td className="py-2 px-3">{r.data.ksm}</td>
                              <td className="py-2 px-3">{r.data.province}</td>
                              <td className="py-2 px-3 whitespace-nowrap">
                                {r.data.period_start} – {r.data.period_end}
                              </td>
                              <td className="py-2 px-3">{r.data.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {valid.length > 10 && (
                        <p className="px-3 py-2 text-xs text-slate-400 border-t border-slate-100">
                          Menampilkan 10 dari {valid.length} baris valid.
                        </p>
                      )}
                    </div>
                  )}
                  {tooMany && (
                    <p className="text-sm text-rose-600">
                      Terlalu banyak baris valid ({valid.length}). Maksimal{" "}
                      {MAX} per impor, silakan pecah file.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {done === null && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              disabled={busy || !valid.length || tooMany}
              onClick={submit}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {busy ? "Mengimpor..." : `Impor ${valid.length} peserta`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
