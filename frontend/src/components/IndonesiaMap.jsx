import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { MapPin } from "lucide-react";
import { PROVINCES } from "../constants/options";

const W = 960,
  H = 400;
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace(/^provinsi/, "");
const ALIAS = {
  jakarta: "DKI Jakarta",
  daerahkhususibukotajakarta: "DKI Jakarta",
  yogyakarta: "DI Yogyakarta",
  daerahistimewayogyakarta: "DI Yogyakarta",
  bangkabelitung: "Kepulauan Bangka Belitung",
  kepbangkabelitung: "Kepulauan Bangka Belitung",
  kepriau: "Kepulauan Riau",
  nanggroeacehdarussalam: "Aceh",
};
const LOOKUP = {
  ...Object.fromEntries(PROVINCES.map((p) => [norm(p), p])),
  ...ALIAS,
};
const canon = (s) => LOOKUP[norm(s)] || null;
// Nama properti provinsi di file GeoJSON. Tambahkan di sini kalau file Anda memakai nama lain.
const KEYS = [
  "PROVINSI",
  "Provinsi",
  "provinsi",
  "PROPINSI",
  "Propinsi",
  "NAME_1",
  "name",
  "NAME",
  "state",
  "Province",
  "province",
  "WADMPR",
];
const nameOf = (p = {}) => {
  const k = KEYS.find((k) => p[k]);
  return k ? p[k] : "";
};

export default function IndonesiaMap({ data }) {
  const [geo, setGeo] = useState(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    fetch("/indonesia-38.geojson")
      .then((r) => r.json())
      .then(setGeo)
      .catch(() => setFailed(true));
  }, []);

  const { counts, unmapped } = useMemo(() => {
    const c = {};
    let other = 0;
    Object.entries(data || {}).forEach(([k, v]) => {
      const p = canon(k);
      if (p) c[p] = (c[p] || 0) + v;
      else other += v;
    });
    return { counts: c, unmapped: other };
  }, [data]);

  const paths = useMemo(() => {
    if (!geo || geo.type !== "FeatureCollection") return [];
    const gp = geoPath(geoMercator().fitSize([W, H], geo));
    const bad = [];
    const out = geo.features.map((f, i) => {
      const raw = nameOf(f.properties);
      const name = canon(raw);
      if (!name) bad.push(raw);
      return { key: i, d: gp(f), name: name || raw };
    });
    if (bad.length)
      console.warn("Nama provinsi di peta tidak cocok dengan daftar:", bad);
    return out;
  }, [geo]);

  const max = Math.max(1, ...Object.values(counts));
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const covered = Object.keys(counts).length;
  const fill = (n) =>
    n ? `rgba(79,70,229,${0.25 + 0.75 * (n / max)})` : "#e2e8f0";

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-3 min-h-[2.5rem]">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            {hover
              ? `${hover.name}: ${hover.count} peserta`
              : "Arahkan kursor atau ketuk sebuah provinsi"}
          </p>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 shrink-0">
            sedikit
            <span className="w-24 h-2 rounded-full bg-gradient-to-r from-indigo-200 to-indigo-600" />
            banyak
          </div>
        </div>
        {failed || (geo && geo.type !== "FeatureCollection") ? (
          <p className="text-center text-sm text-slate-400 py-16">
            Peta belum bisa dimuat. Pastikan file indonesia-38.geojson ada di
            folder public dan berformat GeoJSON.
          </p>
        ) : !geo ? (
          <p className="text-center text-sm text-slate-400 py-16">
            Memuat peta...
          </p>
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            onMouseLeave={() => setHover(null)}
          >
            {paths.map((p) => {
              const n = counts[p.name] || 0;
              const active = hover?.name === p.name;
              return (
                <path
                  key={p.key}
                  d={p.d}
                  fill={fill(n)}
                  stroke={active ? "#1e293b" : "#ffffff"}
                  strokeWidth={active ? 1.4 : 0.6}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHover({ name: p.name, count: n })}
                  onClick={() => setHover({ name: p.name, count: n })}
                />
              );
            })}
          </svg>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <h3 className="font-bold text-slate-800">Provinsi Terbanyak</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {covered} dari {PROVINCES.length} provinsi terwakili
        </p>
        <div className="mt-5 space-y-4">
          {top.length === 0 && (
            <p className="text-sm text-slate-400">Belum ada data provinsi.</p>
          )}
          {top.map(([name, n], i) => (
            <div key={name}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">
                  {i + 1}. {name}
                </span>
                <span className="font-semibold text-slate-800">{n}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${(n / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {unmapped > 0 && (
          <p className="text-xs text-amber-600 mt-5">
            {unmapped} peserta belum terpetakan (nama provinsi tidak sesuai
            daftar).
          </p>
        )}
      </div>
    </div>
  );
}
