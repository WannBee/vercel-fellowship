import { useState } from "react";
import { Field } from "../components/FormField";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(f);
      nav("/dashboard");
    } catch (x) {
      setErr(errMsg(x, "Gagal terhubung ke server."));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Login Fellowship
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Masuk untuk mengelola data pelatihan peserta
          </p>
        </div>
        {err && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl">
            {err}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <Field
            f={f}
            setF={setF}
            k="email"
            type="email"
            label="Email"
            placeholder="nama@example.com"
          />

          {/* Field password dengan tombol toggle visibility */}
          <div className="relative">
            <Field
              f={f}
              setF={setF}
              k="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="••••••••"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? (
                /* Ikon Sembunyikan (Eye Off) */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                /* Ikon Tampilkan (Eye On) */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-600/20">
            Masuk
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Buat akun di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
