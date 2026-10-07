import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  LayoutDashboard,
  Users,
  GraduationCap,
  PlayCircle,
  UserPlus,
  Clock,
  Landmark,
  Coins,
  Wallet,
  Stethoscope,
  HeartPulse,
  Building2,
  Award,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  KSM,
  FELLOWSHIP,
  FUNDING,
  ALL_LABEL,
  STATUS_LABEL,
} from "../constants/options";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const HERO_IMAGE = "/hero.jpg"; // taruh gambar Anda di frontend/public/hero.jpg

const TONES = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

// ---------- Konfigurasi & helper grafik ----------
const PALETTE = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];
const OTHER = { key: "__other", label: "Lainnya", color: "#94a3b8" };
const STATUS_COLORS = {
  "telah lulus": "#10b981",
  "sedang pendidikan": "#8b5cf6",
  "akan pendidikan": "#3b82f6",
  cuti: "#f59e0b",
};
const STATUS_SERIES = Object.entries(STATUS_COLORS).map(([key, color]) => ({
  key,
  color,
  label: STATUS_LABEL[key],
}));

// Ambil N kategori teratas (total semua tahun), sisanya digabung jadi "Lainnya"
function topSeries(rows, n = 5) {
  const total = {};
  rows.forEach((r) =>
    Object.entries(r.counts).forEach(([k, v]) => {
      total[k] = (total[k] || 0) + v;
    }),
  );
  const keys = Object.keys(total).sort((a, b) => total[b] - total[a]);
  const top = keys.slice(0, n);
  const series = top.map((k, i) => ({ key: k, label: k, color: PALETTE[i] }));
  if (keys.length > n) series.push(OTHER);

  const merged = rows.map((r) => {
    const counts = {};
    let other = 0;
    Object.entries(r.counts).forEach(([k, v]) => {
      if (top.includes(k)) counts[k] = v;
      else other += v;
    });
    if (other) counts[OTHER.key] = other;
    return { year: r.year, counts };
  });
  return { series, rows: merged };
}

// ---------- Komponen (di luar fungsi utama agar tidak dibuat ulang tiap render) ----------
const Section = ({ title, desc, children, onDark = false }) => (
  <section className="space-y-5">
    <div>
      <div className="flex items-center gap-3">
        <span
          className={`w-1.5 h-7 rounded-full ${onDark ? "bg-white/80" : "bg-gradient-to-b from-indigo-500 to-purple-600"}`}
        />
        <h2
          className={`text-xl sm:text-2xl font-bold ${onDark ? "text-white" : "text-slate-800"}`}
        >
          {title}
        </h2>
      </div>
      <p
        className={`text-sm mt-2 max-w-3xl ${onDark ? "text-indigo-100" : "text-slate-500"}`}
      >
        {desc}
      </p>
    </div>
    {children}
  </section>
);

const InfoCard = ({ label, value, icon: Icon, tone = "indigo" }) => (
  <div
    title={label}
    className="group h-48 flex flex-col rounded-2xl p-4 border border-slate-200 bg-white shadow-sm cursor-default transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-transparent hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-700"
  >
    <div
      className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white ${TONES[tone]}`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-3xl font-bold mt-3 text-slate-800 transition-colors duration-300 group-hover:text-white">
      {value ?? "–"}
    </p>
    <p className="text-sm mt-1 leading-snug text-slate-500 line-clamp-3 break-words transition-colors duration-300 group-hover:text-indigo-100">
      {label}
    </p>
  </div>
);

const StackedBarChart = ({ title, rows, series }) => {
  const totalOf = (r) => series.reduce((a, s) => a + (r.counts[s.key] || 0), 0);
  const max = Math.max(1, ...rows.map(totalOf));
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((t) => Math.round(max * t));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <h3 className="font-bold text-slate-800">{title}</h3>
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
        {series.map((s) => (
          <span
            key={s.key}
            className="flex items-center gap-2 text-xs text-slate-600"
          >
            <span
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-16">
          Belum ada data periode untuk ditampilkan.
        </p>
      ) : (
        <div className="flex gap-3 mt-6">
          <div className="flex flex-col justify-between h-64 text-xs text-slate-400 text-right pb-7">
            {ticks.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
          <div className="flex-1 overflow-x-auto">
            <div
              className="relative h-64 min-w-full"
              style={{ minWidth: rows.length * 72 }}
            >
              <div className="absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between pointer-events-none">
                {ticks.map((_, i) => (
                  <div key={i} className="border-t border-slate-100" />
                ))}
              </div>
              <div className="relative h-full flex items-end gap-3 px-2">
                {rows.map((r) => {
                  const total = totalOf(r);
                  return (
                    <div
                      key={r.year}
                      className="flex-1 min-w-[3.5rem] h-full flex flex-col justify-end items-center"
                    >
                      <div className="w-full flex-1 flex flex-col justify-end items-center">
                        <span className="text-xs font-semibold text-slate-600 mb-1">
                          {total}
                        </span>
                        <div
                          className="w-full max-w-[3.5rem] flex flex-col-reverse rounded-t-lg overflow-hidden transition-all hover:opacity-90"
                          style={{ height: `${(total / max) * 100}%` }}
                        >
                          {series.map((s) => {
                            const n = r.counts[s.key] || 0;
                            return n ? (
                              <div
                                key={s.key}
                                title={`${r.year} · ${s.label}: ${n}`}
                                style={{
                                  height: `${(n / total) * 100}%`,
                                  background: s.color,
                                }}
                              />
                            ) : null;
                          })}
                        </div>
                      </div>
                      <span className="h-7 flex items-center text-xs font-medium text-slate-500">
                        {r.year}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function HeroVisual() {
  const [ok, setOk] = useState(true);
  if (ok)
    return (
      <img
        src={HERO_IMAGE}
        alt="Program fellowship"
        onError={() => setOk(false)}
        className="w-full h-72 sm:h-96 object-cover rounded-3xl shadow-2xl border-4 border-white/20"
      />
    );
  // Tampilan cadangan kalau hero.jpg belum ada
  return (
    <div className="relative h-72 sm:h-96 rounded-3xl bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-8 w-56 h-56 rounded-full bg-white/10" />
      <Stethoscope className="w-32 h-32 text-white/90" strokeWidth={1.2} />
      <HeartPulse className="absolute top-8 left-8 w-12 h-12 text-rose-200" />
      <GraduationCap className="absolute bottom-8 right-8 w-14 h-14 text-amber-200" />
    </div>
  );
}

// ---------- Halaman ----------
export default function Landing() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [yearly, setYearly] = useState({});

  useEffect(() => {
    API.get("/api/public/stats")
      .then((r) => setS(r.data))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    Promise.all(
      ["status", "funding", "ksm", "fellowship"].map((g) =>
        API.get("/api/public/yearly", { params: { group: g } })
          .then((r) => [g, r.data])
          .catch(() => [g, []]),
      ),
    ).then((entries) => setYearly(Object.fromEntries(entries)));
  }, []);

  const st = s?.status || {};
  const fellowships = showAll ? FELLOWSHIP : FELLOWSHIP.slice(0, 12);
  const fundingIcons = [Landmark, Coins, Wallet, Building2];
  const fundingTones = ["indigo", "emerald", "amber", "rose"];

  const ksmChart = topSeries(yearly.ksm || []);
  const fellowshipChart = topSeries(yearly.fellowship || []);
  const fundingSeries = FUNDING.map((f, i) => ({
    key: f,
    label: f,
    color: PALETTE[i % PALETTE.length],
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Users className="w-6 h-6 text-indigo-600" />
            FellowshipApp
          </div>
          <Link
            to={user ? "/dashboard" : "/login"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
          >
            {user ? (
              <>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Masuk
              </>
            )}
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-32 sm:pt-16 sm:pb-36 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-medium">
              <Award className="w-4 h-4" />
              Program Fellowship
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold mt-4 leading-tight">
              Data Peserta Fellowship
            </h1>
            <p className="mt-4 text-indigo-100 max-w-xl">{LOREM}</p>
            <p className="mt-3 text-indigo-100/80 max-w-xl text-sm">{LOREM}</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="#statistik"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg"
              >
                Lihat Data
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to={user ? "/dashboard" : "/login"}
                className="px-5 py-3 rounded-xl text-sm font-semibold border border-white/40 hover:bg-white/10"
              >
                {user ? "Ke Dashboard" : "Masuk"}
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <main id="statistik" className="max-w-7xl mx-auto px-4 pb-16 space-y-14">
        {error && (
          <p className="text-center text-rose-600 pt-8">
            Gagal memuat data. Coba muat ulang halaman.
          </p>
        )}

        <div className="-mt-20">
          <Section onDark title="Peserta Fellowship" desc={LOREM}>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <InfoCard
                label={ALL_LABEL}
                value={s?.total}
                icon={Users}
                tone="indigo"
              />
              <InfoCard
                label={STATUS_LABEL["telah lulus"]}
                value={st["telah lulus"] ?? (s ? 0 : undefined)}
                icon={GraduationCap}
                tone="emerald"
              />
              <InfoCard
                label={STATUS_LABEL["sedang pendidikan"]}
                value={st["sedang pendidikan"] ?? (s ? 0 : undefined)}
                icon={PlayCircle}
                tone="purple"
              />
              <InfoCard
                label={STATUS_LABEL["akan pendidikan"]}
                value={st["akan pendidikan"] ?? (s ? 0 : undefined)}
                icon={UserPlus}
                tone="blue"
              />
              <InfoCard
                label={STATUS_LABEL.cuti}
                value={st.cuti ?? (s ? 0 : undefined)}
                icon={Clock}
                tone="amber"
              />
            </div>
            <StackedBarChart
              title="Peserta Fellowship per Tahun"
              rows={yearly.status || []}
              series={STATUS_SERIES}
            />
          </Section>
        </div>

        <Section title="Jenis Pembiayaan" desc={LOREM}>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {FUNDING.map((f, i) => (
              <InfoCard
                key={f}
                label={f}
                value={s ? (s.funding?.[f] ?? 0) : undefined}
                icon={fundingIcons[i % fundingIcons.length]}
                tone={fundingTones[i % fundingTones.length]}
              />
            ))}
          </div>
          <StackedBarChart
            title="Jenis Pembiayaan per Tahun"
            rows={yearly.funding || []}
            series={fundingSeries}
          />
        </Section>

        <Section title="KSM / Instalasi" desc={LOREM}>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {KSM.map((k) => (
              <InfoCard
                key={k}
                label={k}
                value={s ? (s.ksm?.[k] ?? 0) : undefined}
                icon={Building2}
                tone="blue"
              />
            ))}
          </div>
          <StackedBarChart
            title="KSM / Instalasi per Tahun (5 Teratas)"
            rows={ksmChart.rows}
            series={ksmChart.series}
          />
        </Section>

        <Section title="Jenis Fellowship" desc={LOREM}>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {fellowships.map((f) => (
              <InfoCard
                key={f}
                label={f}
                value={s ? (s.fellowship?.[f] ?? 0) : undefined}
                icon={Award}
                tone="purple"
              />
            ))}
          </div>
          {FELLOWSHIP.length > 12 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50"
              >
                {showAll ? (
                  <>
                    Tampilkan lebih sedikit
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Tampilkan semua ({FELLOWSHIP.length})
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
          <StackedBarChart
            title="Jenis Fellowship per Tahun (5 Teratas)"
            rows={fellowshipChart.rows}
            series={fellowshipChart.series}
          />
        </Section>
      </main>

      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Users className="w-5 h-5 text-indigo-400" />
            FellowshipApp
          </div>
          <p className="text-center">{LOREM.slice(0, 60)}...</p>
          <p>© {new Date().getFullYear()} FellowshipApp</p>
        </div>
      </footer>
    </div>
  );
}
