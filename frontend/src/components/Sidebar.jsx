import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Users,
  UserPlus,
  Clock,
  PlayCircle,
  CheckCircle,
  LayoutDashboard,
  LogOut,
  UserCircle,
  ShieldCheck,
  Globe,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useParticipants } from "../context/ParticipantsContext";
import { ALL_LABEL, STATUS_LABEL } from "../constants/options";

const MENU = [
  { key: "Semua", label: ALL_LABEL, icon: LayoutDashboard },
  {
    key: "akan pendidikan",
    label: STATUS_LABEL["akan pendidikan"],
    icon: UserPlus,
  },
  {
    key: "sedang pendidikan",
    label: STATUS_LABEL["sedang pendidikan"],
    icon: PlayCircle,
  },
  { key: "cuti", label: STATUS_LABEL.cuti, icon: Clock },
  { key: "telah lulus", label: STATUS_LABEL["telah lulus"], icon: CheckCircle },
];
const base =
  "w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all";
const on = "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30";
const off = "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200";

export default function Sidebar({ open, onClose }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [sp] = useSearchParams();
  const { user, logout } = useAuth();
  const { counts } = useParticipants();
  const active = pathname === "/dashboard" ? sp.get("status") || "Semua" : null;

  const go = (to) => {
    nav(to);
    onClose?.();
  };
  const goStatus = (key) =>
    go(
      key === "Semua"
        ? "/dashboard"
        : `/dashboard?status=${encodeURIComponent(key)}`,
    );
  const out = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) logout();
  };

  const accountItem = (to, Icon, label) => (
    <button
      onClick={() => go(to)}
      className={`${base} ${pathname === to ? on : off}`}
    >
      <span className="flex items-center gap-3">
        <Icon className="w-5 h-5 shrink-0" />
        {label}
      </span>
    </button>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800`}
      >
        <div className="overflow-y-auto">
          <div className="p-6 border-b border-slate-800 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-400" />
                FellowshipApp
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Halo, {user.name} · {user.role}
              </p>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-slate-400"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {MENU.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => goStatus(key)}
                className={`${base} ${active === key ? on : off}`}
              >
                <span className="flex items-center gap-3 text-left leading-snug">
                  <Icon className="w-5 h-5 shrink-0" />
                  {label}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${active === key ? "bg-indigo-700" : "bg-slate-800 text-slate-400"}`}
                >
                  {counts[key]}
                </span>
              </button>
            ))}
            <p className="px-4 pt-4 pb-1 text-[11px] uppercase tracking-wider text-slate-600">
              Akun
            </p>
            {accountItem("/profile", UserCircle, "Profil")}
            {user.role === "admin" &&
              accountItem("/roles", ShieldCheck, "Manajemen Role")}
            {accountItem("/", Globe, "Halaman Publik")}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={out}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
