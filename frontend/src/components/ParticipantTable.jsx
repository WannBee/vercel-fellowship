import {
  Edit2,
  Trash2,
  Building2,
  MapPin,
  Calendar,
  Award,
  Wallet,
  EyeOff,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { STATUS, STATUS_LABEL } from "../constants/options";
import { formatPeriod } from "../utils/FormatDate";

const badge = {
  "akan pendidikan": "bg-blue-100 text-blue-700 border-blue-200",
  "sedang pendidikan": "bg-purple-100 text-purple-700 border-purple-200",
  cuti: "bg-amber-100 text-amber-700 border-amber-200",
  "telah lulus": "bg-emerald-100 text-emerald-700 border-emerald-200",
};
const Meta = ({ icon: I, children, cls = "text-slate-500" }) => (
  <div className={`flex items-start gap-1.5 text-xs mt-1 ${cls}`}>
    <I className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
    <span className="break-words min-w-0">{children}</span>
  </div>
);
const HiddenTag = ({ p }) =>
  p.is_public === false ? (
    <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 align-middle">
      <EyeOff className="w-3 h-3" />
      Tersembunyi
    </span>
  ) : null;
const StatusSelect = ({ p, onChange }) => (
  <select
    value={p.status}
    onChange={(e) => onChange(p, e.target.value)}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[16rem] ${badge[p.status]}`}
  >
    {STATUS.map((s) => (
      <option key={s} value={s} className="bg-white text-slate-700">
        {STATUS_LABEL[s]}
      </option>
    ))}
  </select>
);
const Actions = ({ p, onEdit, onDelete }) => (
  <div className="flex gap-2">
    <button
      onClick={() => onEdit(p)}
      title="Edit"
      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
    >
      <Edit2 className="w-4 h-4" />
    </button>
    <button
      onClick={() => onDelete(p.id)}
      title="Hapus"
      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);
const Check = (props) => (
  <input
    type="checkbox"
    className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer"
    {...props}
  />
);
const SortTh = ({ label, k, sort, onSort }) => (
  <th className="py-4 px-6">
    <button
      onClick={() => onSort(k)}
      className="inline-flex items-center gap-1 uppercase tracking-wider font-semibold hover:text-slate-900"
    >
      {label}
      {sort.key === k &&
        (sort.dir === "asc" ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        ))}
    </button>
  </th>
);

export default function ParticipantTable({
  participants = [],
  onStatusChange,
  onEdit,
  onDelete,
  selected = new Set(),
  onToggle = () => {},
  onToggleAll = () => {},
  sort = { key: "", dir: "asc" },
  onSort = () => {},
}) {
  if (!participants.length)
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        Tidak ada data anggota ditemukan.
      </div>
    );
  const allChecked = participants.every((p) => selected.has(p.id));

  return (
    <>
      {/* Mobile: kartu */}
      <div className="md:hidden space-y-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-2xl border shadow-sm p-4 ${selected.has(p.id) ? "border-indigo-400 ring-1 ring-indigo-300" : "border-slate-200"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0">
                <div className="pt-1">
                  <Check
                    checked={selected.has(p.id)}
                    onChange={() => onToggle(p.id)}
                    aria-label={`Pilih ${p.name}`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 break-words">
                    {p.name}
                    <HiddenTag p={p} />
                  </div>
                  <div className="text-sm font-medium text-indigo-600 mt-0.5">
                    {p.ksm}
                  </div>
                </div>
              </div>
              <Actions p={p} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <Meta icon={Award}>{p.fellowship}</Meta>
            <Meta icon={Building2} cls="text-slate-700">
              {p.hospital}
            </Meta>
            <Meta icon={MapPin}>{p.province}</Meta>
            <Meta icon={Calendar} cls="text-slate-600 font-medium">
              {formatPeriod(p.period_start, p.period_end)}
            </Meta>
            <Meta icon={Wallet}>{p.funding || "-"}</Meta>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <StatusSelect p={p} onChange={onStatusChange} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/tablet: tabel */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-xs">
              <th className="py-4 pl-6 w-10">
                <Check
                  checked={allChecked}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  aria-label="Pilih semua di halaman ini"
                />
              </th>
              <SortTh label="Nama" k="name" sort={sort} onSort={onSort} />
              <SortTh
                label="KSM / Fellowship"
                k="ksm"
                sort={sort}
                onSort={onSort}
              />
              <SortTh
                label="Asal RS & Provinsi"
                k="hospital"
                sort={sort}
                onSort={onSort}
              />
              <SortTh
                label="Periode & Biaya"
                k="period_start"
                sort={sort}
                onSort={onSort}
              />
              <SortTh label="Status" k="status" sort={sort} onSort={onSort} />
              <th className="py-4 px-6 text-center uppercase tracking-wider font-semibold">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {participants.map((p) => (
              <tr
                key={p.id}
                className={`transition-colors ${selected.has(p.id) ? "bg-indigo-50/60" : "hover:bg-slate-50/50"}`}
              >
                <td className="py-4 pl-6">
                  <Check
                    checked={selected.has(p.id)}
                    onChange={() => onToggle(p.id)}
                    aria-label={`Pilih ${p.name}`}
                  />
                </td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-900">
                    {p.name}
                    <HiddenTag p={p} />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-indigo-600">{p.ksm}</div>
                  <Meta icon={Award}>{p.fellowship}</Meta>
                </td>
                <td className="py-4 px-6">
                  <Meta icon={Building2} cls="text-slate-700">
                    {p.hospital}
                  </Meta>
                  <Meta icon={MapPin}>{p.province}</Meta>
                </td>
                <td className="py-4 px-6">
                  <Meta icon={Calendar} cls="text-slate-600 font-medium">
                    {formatPeriod(p.period_start, p.period_end)}
                  </Meta>
                  <Meta icon={Wallet}>{p.funding || "-"}</Meta>
                </td>
                <td className="py-4 px-6">
                  <StatusSelect p={p} onChange={onStatusChange} />
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center">
                    <Actions p={p} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
