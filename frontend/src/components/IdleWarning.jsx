import { Clock } from "lucide-react";

export default function IdleWarning({ seconds, onStay, onLogout }) {
  if (seconds === null) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl"
      >
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mt-4">
          Sesi akan berakhir
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Tidak ada aktivitas. Anda akan keluar otomatis dalam{" "}
          <b className="text-slate-800">{seconds}</b> detik.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Keluar
          </button>
          <button
            onClick={onStay}
            autoFocus
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Tetap Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
