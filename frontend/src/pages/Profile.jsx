import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../services/api";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [msg, setMsg] = useState("");
  const c =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400";
  const submit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(name);
      setMsg("Profil tersimpan ✓");
    } catch (x) {
      setMsg(errMsg(x));
    }
  };
  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Profil Saya</h2>
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
      >
        {[
          ["Nama", name, (e) => setName(e.target.value), false],
          ["Email", user.email, null, true],
          ["Role", user.role, null, true],
        ].map(([l, v, fn, d]) => (
          <div key={l}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              {l}
            </label>
            <input value={v} onChange={fn} disabled={d} className={c} />
          </div>
        ))}
        <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700">
          Simpan
        </button>
        {msg && <span className="ml-3 text-sm text-slate-500">{msg}</span>}
      </form>
    </div>
  );
}
