import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Download,
  LayoutDashboard,
  UserPlus,
  PlayCircle,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParticipants } from "../context/ParticipantsContext";
import { errMsg } from "../services/api";
import { KSM } from "../constants/options";
import { exportCsv } from "../utils/exportCsv";
import StatCard from "../components/StatCard";
import ParticipantTable from "../components/ParticipantTable";
import ParticipantModal from "../components/ParticipantModal";

const CARDS = [
  ["Semua", "Semua Anggota", LayoutDashboard, "indigo"],
  ["akan pendidikan", "Akan Pendidikan", UserPlus, "blue"],
  ["sedang pendidikan", "Sedang Pendidikan", PlayCircle, "purple"],
  ["cuti", "Cuti", Clock, "amber"],
  ["telah lulus", "Telah Lulus", CheckCircle, "emerald"],
];
const PER_PAGE = 10;

export default function Dashboard() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const filter = sp.get("status") || "Semua";
  const { rows, loading, counts, add, update, remove } = useParticipants();
  const [q, setQ] = useState("");
  const [ksm, setKsm] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, item: null });

  const shown = rows.filter(
    (r) =>
      (filter === "Semua" || r.status === filter) &&
      (!ksm || r.ksm === ksm) &&
      `${r.name} ${r.email} ${r.hospital} ${r.province} ${r.fellowship}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(shown.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const slice = shown.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);

  const guard =
    (fn) =>
    async (...a) => {
      try {
        await fn(...a);
      } catch (e) {
        alert(errMsg(e));
      }
    };
  const save = guard(async (d) => (d.id ? update(d.id, d) : add(d)));
  const changeStatus = guard((p, status) => update(p.id, { ...p, status }));
  const del = guard(async (id) => {
    if (confirm("Hapus data anggota ini?")) await remove(id);
  });
  const input =
    "px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 capitalize">
            {filter === "Semua" ? "Dashboard Pelatihan" : filter}
          </h2>
          <p className="text-sm text-slate-500">
            {shown.length} anggota ditemukan
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportCsv(shown)}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setModal({ open: true, item: null })}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>
      </div>

      {filter === "Semua" && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {CARDS.map(([key, title, icon, color]) => (
            <div
              key={key}
              className={key === "Semua" ? "col-span-2 lg:col-span-1" : ""}
            >
              <StatCard
                title={title}
                count={counts[key]}
                icon={icon}
                color={color}
                onClick={() =>
                  key !== "Semua" &&
                  nav(`/dashboard?status=${encodeURIComponent(key)}`)
                }
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama, email, RS, provinsi..."
            className={`${input} w-full pl-10`}
          />
        </div>
        <select
          value={ksm}
          onChange={(e) => {
            setKsm(e.target.value);
            setPage(1);
          }}
          className={`${input} w-full sm:w-auto`}
        >
          <option value="">Semua KSM/Instalasi</option>
          {KSM.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-12">Memuat data...</p>
      ) : (
        <ParticipantTable
          participants={slice}
          onStatusChange={changeStatus}
          onEdit={(item) => setModal({ open: true, item })}
          onDelete={del}
        />
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Halaman {cur} dari {pages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={cur === 1}
              onClick={() => setPage(cur - 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={cur === pages}
              onClick={() => setPage(cur + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <ParticipantModal
        isOpen={modal.open}
        participantToEdit={modal.item}
        onClose={() => setModal({ open: false, item: null })}
        onSave={save}
      />
    </div>
  );
}
