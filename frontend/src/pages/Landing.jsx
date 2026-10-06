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
// Komponen didefinisikan di luar fungsi utama agar tidak dibuat ulang tiap render
const Section = ({ title, desc, children }) => (
  <section className="space-y-5">
    <div>
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          {title}
        </h2>
      </div>
      <p className="text-sm text-slate-500 mt-2 max-w-3xl">{desc}</p>
    </div>
    {children}
  </section>
);
const BigCard = ({ label, value, icon: Icon, tone, featured }) => (
  <div
    className={`rounded-2xl p-5 border shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 ${featured ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-transparent" : "bg-white border-slate-200"}`}
  >
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center ${featured ? "bg-white/20 text-white" : TONES[tone]}`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <p
      className={`text-3xl font-bold mt-4 ${featured ? "text-white" : "text-slate-800"}`}
    >
      {value ?? "–"}
    </p>
    <p
      className={`text-sm mt-1 leading-snug ${featured ? "text-indigo-100" : "text-slate-500"}`}
    >
      {label}
    </p>
  </div>
);
const MiniCard = ({ label, value, icon: Icon, tone = "indigo" }) => (
  <div
    className={`flex items-center gap-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${value ? "" : "opacity-60"}`}
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TONES[tone]}`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <p className="flex-1 min-w-0 text-sm font-medium text-slate-700 leading-snug break-words">
      {label}
    </p>
    <span className="text-lg font-bold text-slate-800">{value ?? "–"}</span>
  </div>
);
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

export default function Landing() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    API.get("/api/public/stats")
      .then((r) => setS(r.data))
      .catch(() => setError(true));
  }, []);

  const st = s?.status || {};
  const fellowships = showAll ? FELLOWSHIP : FELLOWSHIP.slice(0, 12);
  const fundingIcons = [Landmark, Coins, Wallet];
  const fundingTones = ["indigo", "emerald", "amber"];

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
          <Section title="Peserta Fellowship" desc={LOREM}>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="col-span-2 lg:col-span-1">
                <BigCard
                  featured
                  label={ALL_LABEL}
                  value={s?.total}
                  icon={Users}
                />
              </div>
              <BigCard
                label={STATUS_LABEL["telah lulus"]}
                value={st["telah lulus"] ?? (s ? 0 : undefined)}
                icon={GraduationCap}
                tone="emerald"
              />
              <BigCard
                label={STATUS_LABEL["sedang pendidikan"]}
                value={st["sedang pendidikan"] ?? (s ? 0 : undefined)}
                icon={PlayCircle}
                tone="purple"
              />
              <BigCard
                label={STATUS_LABEL["akan pendidikan"]}
                value={st["akan pendidikan"] ?? (s ? 0 : undefined)}
                icon={UserPlus}
                tone="blue"
              />
              <BigCard
                label={STATUS_LABEL.cuti}
                value={st.cuti ?? (s ? 0 : undefined)}
                icon={Clock}
                tone="amber"
              />
            </div>
          </Section>
        </div>

        <Section title="Jenis Pembiayaan" desc={LOREM}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FUNDING.map((f, i) => (
              <MiniCard
                key={f}
                label={f}
                value={s ? (s.funding?.[f] ?? 0) : undefined}
                icon={fundingIcons[i % 3]}
                tone={fundingTones[i % 3]}
              />
            ))}
          </div>
        </Section>

        <Section title="KSM / Instalasi" desc={LOREM}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {KSM.map((k) => (
              <MiniCard
                key={k}
                label={k}
                value={s ? (s.ksm?.[k] ?? 0) : undefined}
                icon={Building2}
                tone="blue"
              />
            ))}
          </div>
        </Section>

        <Section title="Jenis Fellowship" desc={LOREM}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fellowships.map((f) => (
              <MiniCard
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
