import { CalendarClock } from "lucide-react";
import { formatPeriod } from "../utils/formatDate";

const DAY = 86400000;
const WINDOW_DAYS = 30;
const MAX_SHOWN = 5;

export default function PeriodReminder({ rows, onEdit }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const items = rows
    .filter((r) => r.status === "sedang pendidikan" && r.period_end)
    .map((r) => ({
      ...r,
      days: Math.ceil(
        (new Date(`${String(r.period_end).slice(0, 10)}T00:00:00`) - today) /
          DAY,
      ),
    }))
    .filter((r) => r.days <= WINDOW_DAYS) // sudah lewat, atau berakhir dalam 30 hari
    .sort((a, b) => a.days - b.days);

  if (!items.length) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-amber-800 font-semibold">
        <CalendarClock className="w-5 h-5" />
        Pengingat Periode ({items.length})
      </div>
      <p className="text-xs text-amber-700 mt-1">
        Peserta berstatus "sedang pendidikan" yang periodenya berakhir dalam{" "}
        {WINDOW_DAYS} hari atau sudah lewat. Klik untuk memperbarui.
      </p>
      <div className="mt-3 space-y-2">
        {items.slice(0, MAX_SHOWN).map((r) => (
          <button
            key={r.id}
            onClick={() => onEdit(r)}
            className="w-full flex items-center justify-between gap-3 text-left bg-white rounded-xl border border-amber-100 px-4 py-3 hover:border-amber-300 transition-colors"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-800 truncate">
                {r.name}
              </span>
              <span className="block text-xs text-slate-500">
                {formatPeriod(r.period_start, r.period_end)}
              </span>
            </span>
            <span
              className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${r.days < 0 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`}
            >
              {r.days < 0
                ? `Terlambat ${Math.abs(r.days)} hari`
                : r.days === 0
                  ? "Berakhir hari ini"
                  : `${r.days} hari lagi`}
            </span>
          </button>
        ))}
      </div>
      {items.length > MAX_SHOWN && (
        <p className="text-xs text-amber-700 mt-3">
          +{items.length - MAX_SHOWN} lainnya
        </p>
      )}
    </div>
  );
}
