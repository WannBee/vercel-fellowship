// Didefinisikan di luar komponen halaman agar input tidak di-remount setiap ketikan
export function Field({ f, setF, k, label, type = "text", ...rest }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
        {label}
      </label>
      <input
        type={type}
        required
        value={f[k]}
        onChange={(e) => setF({ ...f, [k]: e.target.value })}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...rest}
      />
    </div>
  );
}
