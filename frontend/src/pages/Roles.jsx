import { useState, useEffect } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import API, { errMsg } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/options";
import { Field } from "../components/FormField";

// Didefinisikan di luar komponen utama agar input tidak kehilangan fokus
function EditModal({ target, isSelf, onClose, onSaved }) {
  const [f, setF] = useState({
    name: target.name,
    email: target.email,
    password: "",
    role: target.role,
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const body = { ...f };
      if (!body.password) delete body.password; // kosong = password tidak diubah
      await API.put(`/api/users/${target.id}`, body);
      onSaved();
      onClose();
    } catch (x) {
      setErr(errMsg(x));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Edit User</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {err && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl">
              {err}
            </div>
          )}
          <Field f={f} setF={setF} k="name" label="Nama" />
          <Field f={f} setF={setF} k="email" type="email" label="Email" />
          <Field
            f={f}
            setF={setF}
            k="password"
            type="password"
            label="Password Baru"
            required={false}
            placeholder="Kosongkan jika tidak diubah"
            minLength={6}
            autoComplete="new-password"
          />
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Role
            </label>
            <select
              value={f.role}
              disabled={isSelf}
              onChange={(e) => setF({ ...f, role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
            >
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            {isSelf && (
              <p className="text-xs text-slate-400 mt-1">
                Role akun sendiri tidak bisa diubah.
              </p>
            )}
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
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Roles() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => setUsers((await API.get("/api/users")).data);
  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await API.patch(`/api/users/${id}/role`, { role });
      load();
    } catch (e) {
      alert(errMsg(e));
    }
  };
  const remove = async (u) => {
    if (
      !confirm(
        `Hapus user "${u.name}"?\nSemua data partisipan milik user ini juga akan terhapus.`,
      )
    )
      return;
    try {
      await API.delete(`/api/users/${u.id}`);
      load();
    } catch (e) {
      alert(errMsg(e));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
        Manajemen User & Role
      </h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <th className="py-4 px-6">Nama</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => {
              const isSelf = u.id === user.id;
              return (
                <tr key={u.id}>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {u.name}
                    {isSelf && (
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        (Anda)
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">{u.email}</td>
                  <td className="py-4 px-6">
                    <select
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditing(u)}
                        title="Edit"
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(u)}
                        disabled={isSelf}
                        title={
                          isSelf ? "Tidak bisa menghapus akun sendiri" : "Hapus"
                        }
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editing && (
        <EditModal
          target={editing}
          isSelf={editing.id === user.id}
          onClose={() => setEditing(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
