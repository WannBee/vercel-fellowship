import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Download,
  Upload,
  ChevronDown,
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
import { KSM, STATUS, ALL_LABEL, STATUS_LABEL } from "../constants/options";
import { exportCsv } from "../utils/exportCsv";
import { exportXlsx } from "../utils/exportXlsx";
import StatCard from "../components/StatCard";
import PeriodReminder from "../components/PeriodReminder";
import ParticipantTable from "../components/ParticipantTable";
import ParticipantModal from "../components/ParticipantModal";
import ImportModal from "../components/ImportModal";

const CARDS = [
  ["Semua", ALL_LABEL, LayoutDashboard, "indigo"],
  ["akan pendidikan", STATUS_LABEL["akan pendidikan"], UserPlus, "blue"],
  [
    "sedang pendidikan",
    STATUS_LABEL["sedang pendidikan"],
    PlayCircle,
    "purple",
  ],
  ["cuti", STATUS_LABEL.cuti, Clock, "amber"],
  ["telah lulus", STATUS_LABEL["telah lulus"], CheckCircle, "emerald"],
];
const SORTS = [
  { key: "name", label: "Nama" },
  { key: "ksm", label: "KSM" },
  { key: "hospital", label: "Asal RS" },
  { key: "period_start", label: "Periode" },
  { key: "status", label: "Status" },
];
const PER_PAGE = 10;
const input =
  "px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";
const btn =
  "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50";

export default function Dashboard() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const filter = sp.get("status") || "Semua";
  const {
    rows,
    loading,
    counts,
    add,
    update,
    remove,
    bulkStatus,
    bulkRemove,
    importRows,
  } = useParticipants();
  const [q, setQ] = useState("");
  const [ksm, setKsm] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "", dir: "asc" });
  const [selected, setSelected] = useState(new Set());
  const [bulkValue, setBulkValue] = useState(STATUS[0]);
  const [modal, setModal] = useState({ open: false, item: null });
  const [importing, setImporting] = useState(false);

  // Pindah kategori: pilihan dikosongkan agar aksi massal tidak mengenai data yang tidak terlihat
  useEffect(() => {
    setSelected(new Set());
    setPage(1);
  }, [filter]);

  const filtered = rows.filter(
    (r) =>
      (filter === "Semua" || r.status === filter) &&
      (!ksm || r.ksm === ksm) &&
      `${r.name} ${r.hospital} ${r.province} ${r.fellowship} ${r.funding || ""}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const dir = sort.dir === "asc" ? 1 : -1;
  const shown = sort.key
    ? [...filtered].sort((a, b) => {
        const x = a[sort.key] ?? "",
          y = b[sort.key] ?? "";
        if (x === "" && y !== "") return 1; // nilai kosong selalu di bawah
        if (y === "" && x !== "") return -1;
        return (
          String(x).localeCompare(String(y), "id", { numeric: true }) * dir
        );
      })
    : filtered;
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
  const save = async (d) => {
    if (d.id) await update(d.id, d);
    else await add(d);
  }; // error ditangani di modal
  const changeStatus = guard((p, status) => update(p.id, { ...p, status }));
  const del = guard(async (id) => {
    if (confirm("Hapus data anggota ini?")) await remove(id);
  });
  const applyStatus = guard(async () => {
    await bulkStatus([...selected], bulkValue);
    setSelected(new Set());
  });
  const applyDelete = guard(async () => {
    if (
      !confirm(
        `Hapus ${selected.size} peserta terpilih? Tindakan ini tidak bisa dibatalkan.`,
      )
    )
      return;
    await bulkRemove([...selected]);
    setSelected(new Set());
  });

  const toggle = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = (checked) =>
    setSelected((s) => {
      const n = new Set(s);
      slice.forEach((r) => (checked ? n.add(r.id) : n.delete(r.id)));
      return n;
    });
  const onSort = (key) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
    setPage(1);
  };
  const reset = () => {
    setPage(1);
    setSelected(new Set());
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            {filter === "Semua" ? "Dashboard Pelatihan" : STATUS_LABEL[filter]}
          </h2>
          <p className="text-sm text-slate-500">
            {shown.length} peserta ditemukan
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setImporting(true)}
            className={`${btn} flex-1 sm:flex-none`}
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <details className="relative flex-1 sm:flex-none">
            <summary
              className={`${btn} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </summary>
            <div
              className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden"
              onClick={(e) =>
                e.currentTarget.closest("details").removeAttribute("open")
              }
            >
              <button
                onClick={() => exportCsv(shown)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
              >
                CSV
              </button>
              <button
                onClick={() =>
                  exportXlsx(shown).catch(() =>
                    alert("Gagal membuat file Excel"),
                  )
                }
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
              >
                Excel (.xlsx)
              </button>
            </div>
          </details>
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

      {filter === "Semua" && (
        <PeriodReminder
          rows={rows}
          onEdit={(item) => setModal({ open: true, item })}
        />
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              reset();
            }}
            placeholder="Cari nama, RS, provinsi..."
            className={`${input} w-full pl-10`}
          />
        </div>
        <select
          value={ksm}
          onChange={(e) => {
            setKsm(e.target.value);
            reset();
          }}
          className={`${input} w-full sm:w-auto`}
        >
          <option value="">Semua KSM/Instalasi</option>
          {KSM.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <select
          value={sort.key ? `${sort.key}:${sort.dir}` : ""}
          className={`${input} w-full sm:w-auto`}
          onChange={(e) => {
            const [key, d] = e.target.value.split(":");
            setSort(key ? { key, dir: d } : { key: "", dir: "asc" });
            setPage(1);
          }}
        >
          <option value="">Urutan bawaan (terbaru)</option>
          {SORTS.flatMap((s) => [
            <option key={`${s.key}:asc`} value={`${s.key}:asc`}>
              {s.label} (A–Z)
            </option>,
            <option key={`${s.key}:desc`} value={`${s.key}:desc`}>
              {s.label} (Z–A)
            </option>,
          ])}
        </select>
      </div>

      {selected.size > 0 && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3">
          <span className="text-sm font-semibold text-indigo-900">
            {selected.size} dipilih
          </span>
          {shown.length > selected.size && (
            <button
              onClick={() => setSelected(new Set(shown.map((r) => r.id)))}
              className="text-xs font-medium text-indigo-700 underline"
            >
              Pilih semua {shown.length} hasil
            </button>
          )}
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <select
              value={bulkValue}
              onChange={(e) => setBulkValue(e.target.value)}
              className={input}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
            <button
              onClick={applyStatus}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Ubah Status
            </button>
            <button
              onClick={applyDelete}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700"
            >
              Hapus
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-white"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-slate-500 py-12">Memuat data...</p>
      ) : (
        <ParticipantTable
          participants={slice}
          onStatusChange={changeStatus}
          onEdit={(item) => setModal({ open: true, item })}
          onDelete={del}
          selected={selected}
          onToggle={toggle}
          onToggleAll={toggleAll}
          sort={sort}
          onSort={onSort}
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
      {importing && (
        <ImportModal
          onClose={() => setImporting(false)}
          onImport={importRows}
        />
      )}
    </div>
  );
}
