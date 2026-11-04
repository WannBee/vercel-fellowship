import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error, info) {
    console.error("Kesalahan tampilan:", error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-slate-800">
            Terjadi kesalahan
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Halaman tidak bisa ditampilkan. Coba muat ulang, atau kembali ke
            beranda.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => location.reload()}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Muat Ulang
            </button>
            {/* <a> biasa, bukan Link, karena router bisa saja ikut rusak */}
            <a
              href="/"
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Ke Beranda
            </a>
          </div>
        </div>
      </div>
    );
  }
}
