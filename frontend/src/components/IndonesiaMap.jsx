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
  "Propinsi",
];
const nameOf = (p) => {
  const props = p || {};
  const k = KEYS.find((k) => props[k]);
  return k ? props[k] : "";
};

// ---- Perbaiki arah poligon agar sesuai aturan d3-geo (ring luar searah jarum jam) ----
const area = (ring) => {
  let a = 0;
  for (let i = 0, n = ring.length - 1; i < n; i++)
    a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  return a / 2;
};
const fixRing = (ring, exterior) => {
  const a = area(ring);
  return (exterior ? a > 0 : a < 0) ? [...ring].reverse() : ring;
};
const fixPolygon = (poly) => poly.map((r, i) => fixRing(r, i === 0));
function rewind(geo) {
  const features = (geo.features || [])
    .filter((f) => f && f.geometry)
    .map((f) => {
      const g = f.geometry;
      if (g.type === "Polygon")
        return {
          ...f,
          geometry: { ...g, coordinates: fixPolygon(g.coordinates) },
        };
      if (g.type === "MultiPolygon")
        return {
          ...f,
          geometry: { ...g, coordinates: g.coordinates.map(fixPolygon) },
        };
      return f;
    });
  return { ...geo, features };
}

export default function IndonesiaMap({ data }) {
  const [geo, setGeo] = useState(null);
  const [failed, setFailed] = useState("");
  const [hover, setHover] = useState(null);

  useEffect(() => {
    fetch("/indonesia-38.geojson")
      .then((r) => {
        if (!r.ok) throw new Error("File tidak ditemukan");
        return r.json();
      })
      .then((j) => {
        if (j.type !== "FeatureCollection")
          throw new Error(
            `Format file "${j.type}" tidak didukung, harus FeatureCollection (GeoJSON)`,
          );
        setGeo(rewind(j));
      })
      .catch((e) =>
        setFailed(
          e instanceof SyntaxError
            ? "File bukan JSON yang valid (kemungkinan file tidak ada, lalu server mengembalikan halaman web)."
            : e.message,
        ),
      );
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

  const { paths, badNames } = useMemo(() => {
    if (!geo || !geo.features.length) return { paths: [], badNames: [] };
    const gp = geoPath(geoMercator().fitSize([W, H], geo));
    const bad = [];
    const out = [];
    geo.features.forEach((f, i) => {
      const raw = nameOf(f.properties);
      const name = canon(raw);
      if (!name) bad.push(raw || "(tanpa nama)");
      const d = gp(f);
      if (d) out.push({ key: i, d, name: name || raw });
    });
    if (bad.length)
      console.warn("Nama provinsi di peta tidak cocok dengan daftar:", bad);
    return { paths: out, badNames: bad };
  }, [geo]);

  const max = Math.max(1, ...Object.values(counts));
  const fill = (n) =>
    n ? `rgba(79,70,229,${0.25 + 0.75 * (n / max)})` : "#e2e8f0";
  const sampleKeys = geo?.features?.[0]?.properties
    ? Object.keys(geo.features[0].properties).join(", ")
    : "-";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
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

      {failed ? (
        <p className="text-center text-sm text-rose-500 py-16">
          Peta belum bisa dimuat: {failed}
        </p>
      ) : !geo ? (
        <p className="text-center text-sm text-slate-400 py-16">
          Memuat peta...
        </p>
      ) : paths.length === 0 ? (
        <p className="text-center text-sm text-amber-600 py-16">
          File terbaca ({geo.features.length} fitur), tetapi tidak ada bentuk
          yang bisa digambar. Pastikan geometrinya Polygon/MultiPolygon.
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

      {unmapped > 0 && (
        <p className="text-xs text-amber-600 mt-3">
          {unmapped} peserta belum terpetakan (nama provinsi tidak sesuai
          daftar).
        </p>
      )}
      {badNames.length > 0 && (
        <p className="text-xs text-amber-600 mt-2 break-words">
          {badNames.length} nama di file peta tidak cocok dengan daftar provinsi
          ({badNames.slice(0, 8).join(", ")}
          {badNames.length > 8 ? ", ..." : ""}). Nama properti yang terbaca dari
          file: {sampleKeys}.
        </p>
      )}
    </div>
  );
}
