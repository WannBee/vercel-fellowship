import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Users, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../services/api";
import { ALL_LABEL, STATUS_LABEL } from "../constants/options";

const TYPES = {
  status: "Status Pelatihan",
  funding: "Jenis Pembiayaan",
  ksm: "Divisi/Departemen",
  fellowship: "Jenis Fellowship",
};
const badge = {
  "akan pendidikan": "bg-blue-100 text-blue-700 border-blue-200",
  "sedang pendidikan": "bg-purple-100 text-purple-700 border-purple-200",
  cuti: "bg-amber-100 text-amber-700 border-amber-200",
  "telah lulus": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function List({ by, value }) {
  const nav = useNavigate();
  const loc = useLocation();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    rows: [],
    total: 0,
    pages: 1,
    perPage: 20,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    setLoading(true);
    setError(false);
    API.get("/api/public/participants", {
      params: { ...(by ? { [by]: value } : {}), page },
    })
      .then((r) => setData(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [by, value, page]);

  // Kalau halaman dibuka langsung dari tautan (tanpa riwayat), tombol kembali menuju beranda
  const goBack = () => (loc.key !== "default" ? nav(-1) : nav("/"));

  const title = !by
    ? ALL_LABEL
    : by === "status"
      ? STATUS_LABEL[value] || value
      : value;
  const subtitle = by ? TYPES[by] : "Semua peserta";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 border border-slate-200 bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Users className="w-5 h-5 text-indigo-600" />
            FellowshipApp
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {subtitle}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1 break-words">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Memuat..." : `${data.total} peserta`}
          </p>
        </div>

        {error ? (
          <p className="text-center text-rose-600 py-12">
            Gagal memuat data. Coba muat ulang halaman.
          </p>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-4 sm:px-6 w-14">No</th>
                  <th className="py-4 px-4 sm:px-6">Nama</th>
                  <th className="py-4 px-4 sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {!loading && data.rows.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-12 text-center text-slate-400"
                    >
                      Belum ada peserta pada kategori ini.
                    </td>
                  </tr>
                )}
                {data.rows.map((p, i) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 text-slate-400">
                      {(data.page - 1) * data.perPage + i + 1}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 break-words">
                      {p.name}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${badge[p.status] || ""}`}
                      >
                        {STATUS_LABEL[p.status] || p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data.pages > 1 && (
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              Halaman {data.page} dari {data.pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= data.pages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ParticipantList() {
  const [sp] = useSearchParams();
  const by = TYPES[sp.get("by")] ? sp.get("by") : null;
  const value = by ? sp.get("value") || "" : "";
  // key membuat halaman diatur ulang (kembali ke halaman 1) kalau kategori berubah
  return <List key={`${by}:${value}`} by={by} value={value} />;
}
