import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  LayoutDashboard,
  Search,
  Users,
  //   ChevronLeft,
  //   ChevronRight,
  //   Building2,
  //   MapPin,
  //   Award,
  //   Calendar,
  //   Mail,
  //   Phone,
  //   Wallet,
} from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { KSM, STATUS, ALL_LABEL, STATUS_LABEL } from "../constants/options";
// import { formatPeriod } from "../utils/FormatDate";

const badge = {
  "akan pendidikan": "bg-blue-100 text-blue-700 border-blue-200",
  "sedang pendidikan": "bg-purple-100 text-purple-700 border-purple-200",
  cuti: "bg-amber-100 text-amber-700 border-amber-200",
  "telah lulus": "bg-emerald-100 text-emerald-700 border-emerald-200",
};
const Badge = ({ s }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium border text-center ${badge[s]}`}
  >
    {STATUS_LABEL[s] || s}
  </span>
);
const Meta = ({ icon: I, children, cls = "text-slate-500" }) => (
  <div className={`flex items-start gap-1.5 text-xs mt-1 ${cls}`}>
    <I className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
    <span className="break-words min-w-0">{children}</span>
  </div>
);
const Stat = ({ label, value, active, onClick }) => (
  <button
    onClick={onClick}
    className={`h-full w-full text-left bg-white rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md ${active ? "ring-2 ring-indigo-600 border-transparent" : "border-slate-200"}`}
  >
    <p className="text-xs font-medium text-slate-500 leading-snug">{label}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value ?? "–"}</p>
  </button>
);
const field =
  "px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function Landing() {
  const { user } = useAuth();
  const [data, setData] = useState({ rows: [], total: 0, pages: 1, page: 1 });
  const [stats, setStats] = useState({});
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [status, setStatus] = useState("");
  const [ksm, setKsm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get("/api/public/stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      setDq(q);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => {
    setLoading(true);
    setError(false);
    API.get("/api/public/participants", {
      params: { q: dq, status, ksm, page },
    })
      .then((r) => setData(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [dq, status, ksm, page]);

  const pick = (s) => {
    setStatus(s);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Users className="w-6 h-6 text-indigo-600" />
            FellowshipApp
          </div>
          <Link
            to={user ? "/dashboard" : "/login"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
          >
            {user ? (
              <>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Masuk
              </>
            )}
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 sm:pt-16 sm:pb-28">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Data Peserta Fellowship
          </h1>
          <p className="mt-3 text-indigo-100 max-w-2xl">
            Daftar peserta program fellowship beserta status pendidikan dan
            sumber biayanya. Gunakan pencarian dan filter untuk menemukan data.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 pb-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 -mt-16">
          <div className="col-span-2 lg:col-span-1">
            <Stat
              label={ALL_LABEL}
              value={stats.total}
              active={!status}
              onClick={() => pick("")}
            />
          </div>
          {STATUS.map((s) => (
            <Stat
              key={s}
              label={STATUS_LABEL[s]}
              value={stats[s] ?? 0}
              active={status === s}
              onClick={() => pick(s)}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama, email, RS, provinsi, fellowship..."
              className={`${field} w-full pl-10`}
            />
          </div>
          <select
            value={ksm}
            onChange={(e) => {
              setKsm(e.target.value);
              setPage(1);
            }}
            className={`${field} w-full sm:w-auto`}
          >
            <option value="">Semua KSM/Instalasi</option>
            {KSM.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* {error ? (
          <p className="text-center text-rose-600 py-12">
            Gagal memuat data. Coba muat ulang halaman.
          </p>
        ) : loading ? (
          <p className="text-center text-slate-500 py-12">Memuat data...</p>
        ) : !data.rows.length ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            Tidak ada data ditemukan.
          </div>
        ) : (
        //   <>
        //     <p className="text-sm text-slate-500">
        //       {data.total} peserta ditemukan
        //     </p>
        //     <div className="md:hidden space-y-3">
        //       {data.rows.map((p) => (
        //         <div
        //           key={p.id}
        //           className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
        //         >
        //           <div className="flex items-start justify-between gap-2">
        //             <div className="font-semibold text-slate-900 break-words min-w-0">
        //               {p.name}
        //             </div>
        //             <Badge s={p.status} />
        //           </div>
        //           <div className="text-sm font-medium text-indigo-600 mt-0.5">
        //             {p.ksm}
        //           </div>
        //           <Meta icon={Award}>{p.fellowship}</Meta>
        //           <Meta icon={Mail}>{p.email}</Meta>
        //           <Meta icon={Phone}>{p.phone}</Meta>
        //           <Meta icon={Building2} cls="text-slate-700">
        //             {p.hospital}
        //           </Meta>
        //           <Meta icon={MapPin}>{p.province}</Meta>
        //           <Meta icon={Calendar} cls="text-slate-600 font-medium">
        //             {formatPeriod(p.period_start, p.period_end)}
        //           </Meta>
        //           <Meta icon={Wallet}>{p.funding || "-"}</Meta>
        //         </div>
        //       ))}
        //     </div>
        //     <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        //       <table className="w-full text-left border-collapse">
        //         <thead>
        //           <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
        //             {[
        //               "Nama & Kontak",
        //               "KSM / Fellowship",
        //               "Asal RS & Provinsi",
        //               "Periode & Biaya",
        //               "Status",
        //             ].map((h) => (
        //               <th key={h} className="py-4 px-6">
        //                 {h}
        //               </th>
        //             ))}
        //           </tr>
        //         </thead>
        //         <tbody className="divide-y divide-slate-100 text-sm">
        //           {data.rows.map((p) => (
        //             <tr
        //               key={p.id}
        //               className="hover:bg-slate-50/50 transition-colors"
        //             >
        //               <td className="py-4 px-6">
        //                 <div className="font-semibold text-slate-900">
        //                   {p.name}
        //                 </div>
        //                 <Meta icon={Mail}>{p.email}</Meta>
        //                 <Meta icon={Phone}>{p.phone}</Meta>
        //               </td>
        //               <td className="py-4 px-6">
        //                 <div className="font-medium text-indigo-600">
        //                   {p.ksm}
        //                 </div>
        //                 <Meta icon={Award}>{p.fellowship}</Meta>
        //               </td>
        //               <td className="py-4 px-6">
        //                 <Meta icon={Building2} cls="text-slate-700">
        //                   {p.hospital}
        //                 </Meta>
        //                 <Meta icon={MapPin}>{p.province}</Meta>
        //               </td>
        //               <td className="py-4 px-6">
        //                 <Meta icon={Calendar} cls="text-slate-600 font-medium">
        //                   {formatPeriod(p.period_start, p.period_end)}
        //                 </Meta>
        //                 <Meta icon={Wallet}>{p.funding || "-"}</Meta>
        //               </td>
        //               <td className="py-4 px-6">
        //                 <Badge s={p.status} />
        //               </td>
        //             </tr>
        //           ))}
        //         </tbody>
        //       </table>
        //     </div>
        //     {data.pages > 1 && (
        //       <div className="flex items-center justify-between text-sm text-slate-500">
        //         <span>
        //           Halaman {data.page} dari {data.pages}
        //         </span>
        //         <div className="flex gap-2">
        //           <button
        //             disabled={page <= 1}
        //             onClick={() => setPage(page - 1)}
        //             className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
        //           >
        //             <ChevronLeft className="w-4 h-4" />
        //           </button>
        //           <button
        //             disabled={page >= data.pages}
        //             onClick={() => setPage(page + 1)}
        //             className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
        //           >
        //             <ChevronRight className="w-4 h-4" />
        //           </button>
        //         </div>
        //       </div>
        //     )}
        //   </>
        )} */}
      </main>
      <footer className="text-center text-xs text-slate-400 py-8">
        © {new Date().getFullYear()} FellowshipApp
      </footer>
    </div>
  );
}
