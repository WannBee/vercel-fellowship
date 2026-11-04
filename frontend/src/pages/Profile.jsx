import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API, { errMsg } from "../services/api";
import { Field } from "../components/FormField";

const card =
  "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4";
const btn =
  "px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60";
const Note = ({ n }) =>
  n ? (
    <p className={`text-sm ${n.ok ? "text-emerald-600" : "text-rose-600"}`}>
      {n.text}
    </p>
  ) : null;
const Static = ({ label, value }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
      {label}
    </label>
    <input
      value={value}
      disabled
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400"
    />
  </div>
);

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [p, setP] = useState({ name: user.name });
  const [pNote, setPNote] = useState(null);
  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [pwNote, setPwNote] = useState(null);
  const [busy, setBusy] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(p.name);
      setPNote({ ok: true, text: "Profil tersimpan ✓" });
    } catch (x) {
      setPNote({ ok: false, text: errMsg(x) });
    }
  };
  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm)
      return setPwNote({ ok: false, text: "Konfirmasi password tidak sama" });
    setBusy(true);
    try {
      await API.put("/api/users/password", {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      setPwNote({ ok: true, text: "Password berhasil diganti ✓" });
    } catch (x) {
      setPwNote({ ok: false, text: errMsg(x) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
        Profil Saya
      </h2>

      <form onSubmit={saveProfile} className={card}>
        <Field f={p} setF={setP} k="name" label="Nama" />
        <Static label="Email" value={user.email} />
        <Static label="Role" value={user.role} />
        <button className={btn}>Simpan</button>
        <Note n={pNote} />
      </form>

      <form onSubmit={savePassword} className={card}>
        <h3 className="font-bold text-slate-800">Ganti Password</h3>
        <Field
          f={pw}
          setF={setPw}
          k="currentPassword"
          type="password"
          label="Password Saat Ini"
          autoComplete="current-password"
        />
        <Field
          f={pw}
          setF={setPw}
          k="newPassword"
          type="password"
          label="Password Baru"
          minLength={6}
          autoComplete="new-password"
        />
        <Field
          f={pw}
          setF={setPw}
          k="confirm"
          type="password"
          label="Ulangi Password Baru"
          minLength={6}
          autoComplete="new-password"
        />
        <button disabled={busy} className={btn}>
          {busy ? "Menyimpan..." : "Ganti Password"}
        </button>
        <Note n={pwNote} />
      </form>
    </div>
  );
}
