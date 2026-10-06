import {
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Award,
  Wallet,
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

export default function ParticipantTable({
  participants = [],
  onStatusChange,
  onEdit,
  onDelete,
}) {
  if (!participants.length)
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        Tidak ada data anggota ditemukan.
      </div>
    );

  return (
    <>
      {/* Mobile: kartu */}
      <div className="md:hidden space-y-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 break-words">
                  {p.name}
                </div>
                <div className="text-sm font-medium text-indigo-600 mt-0.5">
                  {p.ksm}
                </div>
              </div>
              <Actions p={p} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <Meta icon={Award}>{p.fellowship}</Meta>
            <Meta icon={Mail}>{p.email}</Meta>
            <Meta icon={Phone}>{p.phone}</Meta>
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
            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              {[
                "Identitas & Kontak",
                "KSM / Fellowship",
                "Asal RS & Provinsi",
                "Periode & Biaya",
                "Status",
              ].map((h) => (
                <th key={h} className="py-4 px-6">
                  {h}
                </th>
              ))}
              <th className="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {participants.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-900">{p.name}</div>
                  <Meta icon={Mail}>{p.email}</Meta>
                  <Meta icon={Phone}>{p.phone}</Meta>
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
