import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  KSM,
  FELLOWSHIP,
  STATUS,
  FUNDING,
  STATUS_LABEL,
} from "../constants/options";
import { errMsg } from "../services/api";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  ksm: KSM[0],
  hospital: "",
  province: "",
  fellowship: FELLOWSHIP[0],
  funding: FUNDING[0],
  period_start: "",
  period_end: "",
  status: "akan pendidikan",
};
const fromRow = (p) => ({
  ...EMPTY,
  ...p,
  funding: p.funding || FUNDING[0],
  period_start: p.period_start || "",
  period_end: p.period_end || "",
});
const cls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

// Komponen di LUAR fungsi utama agar input tidak kehilangan fokus
const Label = ({ children }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
    {children}
  </label>
);
const Input = ({ f, set, k, label, onChange, ...r }) => (
  <div>
    <Label>{label}</Label>
    <input
      required
      value={f[k]}
      onChange={onChange || set(k)}
      className={cls}
      {...r}
    />
  </div>
);
const Sel = ({ f, set, k, label, opts, labels }) => (
  <div>
    <Label>{label}</Label>
    <select value={f[k]} onChange={set(k)} className={cls}>
      {opts.map((o) => (
        <option key={o} value={o}>
          {labels ? labels[o] : o}
        </option>
      ))}
    </select>
  </div>
);

export default function ParticipantModal({
  isOpen,
  onClose,
  onSave,
  participantToEdit,
}) {
  const [f, setF] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setF(participantToEdit ? fromRow(participantToEdit) : EMPTY);
    setErr("");
  }, [participantToEdit, isOpen]);
  if (!isOpen) return null;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  // Kalau tanggal mulai digeser melewati tanggal selesai, tanggal selesai ikut menyesuaikan
  const setStart = (e) => {
    const v = e.target.value;
    setF({
      ...f,
      period_start: v,
      period_end: f.period_end && f.period_end < v ? v : f.period_end,
    });
  };
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await onSave(f);
      onClose();
    } catch (x) {
      setErr(errMsg(x));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {participantToEdit ? "Edit" : "Tambah"} Anggota Fellowship
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={submit}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {err && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl">
              {err}
            </div>
          )}
          <Input
            f={f}
            set={set}
            k="name"
            label="Nama Lengkap & Gelar"
            placeholder="Dr. Budi Santoso, Sp.A"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              f={f}
              set={set}
              k="email"
              type="email"
              label="Email"
              placeholder="budi@example.com"
            />
            <Input
              f={f}
              set={set}
              k="phone"
              label="Nomor Telepon"
              placeholder="08123456789"
            />
            <Sel f={f} set={set} k="ksm" label="KSM / Instalasi" opts={KSM} />
            <Sel
              f={f}
              set={set}
              k="fellowship"
              label="Jenis Fellowship"
              opts={FELLOWSHIP}
            />
            <Input
              f={f}
              set={set}
              k="hospital"
              label="Asal Rumah Sakit"
              placeholder="RSUD Dr. Soetomo"
            />
            <Input
              f={f}
              set={set}
              k="province"
              label="Provinsi"
              placeholder="Jawa Timur"
            />
            <Sel
              f={f}
              set={set}
              k="funding"
              label="Sumber Biaya"
              opts={FUNDING}
            />
            <Sel
              f={f}
              set={set}
              k="status"
              label="Status Pelatihan"
              opts={STATUS}
              labels={STATUS_LABEL}
            />
            <Input
              f={f}
              set={set}
              k="period_start"
              type="date"
              label="Periode Mulai"
              onChange={setStart}
            />
            <Input
              f={f}
              set={set}
              k="period_end"
              type="date"
              label="Periode Selesai"
              min={f.period_start || undefined}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
