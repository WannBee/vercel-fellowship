const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="font-bold text-slate-800">{title}</h3>
    {children}
  </div>
);

// Grafik garis: satu garis per kategori, satu titik per tahun (sumbu x = Periode Mulai)
export function LineChart({ title, rows, series }) {
  const W = 640,
    H = 280;
  const P = { l: 44, r: 20, t: 16, b: 36 };
  const iw = W - P.l - P.r,
    ih = H - P.t - P.b;
  const max = Math.max(
    1,
    ...rows.flatMap((r) => series.map((s) => r.counts[s.key] || 0)),
  );
  const ticks = [
    ...new Set([0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t))),
  ];
  const x = (i) =>
    P.l + (rows.length < 2 ? iw / 2 : (i * iw) / (rows.length - 1));
  const y = (v) => P.t + (1 - v / max) * ih;

  return (
    <Card title={title}>
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
        {series.map((s) => (
          <span
            key={s.key}
            className="flex items-center gap-2 text-xs text-slate-600"
          >
            <span
              className="w-3 h-1 rounded-full shrink-0"
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
        <div className="overflow-x-auto mt-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full min-w-[480px] h-auto"
          >
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={P.l}
                  x2={W - P.r}
                  y1={y(t)}
                  y2={y(t)}
                  className="stroke-slate-100"
                />
                <text
                  x={P.l - 8}
                  y={y(t) + 4}
                  textAnchor="end"
                  className="fill-slate-400"
                  fontSize="11"
                >
                  {t}
                </text>
              </g>
            ))}
            {rows.map((r, i) => (
              <text
                key={r.year}
                x={x(i)}
                y={H - 12}
                textAnchor="middle"
                className="fill-slate-500"
                fontSize="12"
              >
                {r.year}
              </text>
            ))}
            {series.map((s) => {
              const pts = rows.map((r, i) => ({
                x: x(i),
                y: y(r.counts[s.key] || 0),
                n: r.counts[s.key] || 0,
                year: r.year,
              }));
              return (
                <g key={s.key}>
                  {pts.length > 1 && (
                    <polyline
                      points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  )}
                  {pts.map((p) => (
                    <circle
                      key={p.year}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill={s.color}
                      stroke="#fff"
                      strokeWidth="1.5"
                    >
                      <title>{`${p.year} · ${s.label}: ${p.n}`}</title>
                    </circle>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </Card>
  );
}

// Donut: komposisi persentase. parts = [{ key, label, color, value }]
export function DonutChart({ title, parts }) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  const R = 52,
    C = 2 * Math.PI * R;
  let used = 0;

  return (
    <Card title={title}>
      {total === 0 ? (
        <p className="text-center text-sm text-slate-400 py-16">
          Belum ada data.
        </p>
      ) : (
        <>
          <div className="relative w-44 h-44 mx-auto mt-4">
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                strokeWidth="18"
                className="stroke-slate-100"
              />
              {parts.map((p) => {
                const len = (p.value / total) * C;
                const offset = -used;
                used += len;
                return len > 0 ? (
                  <circle
                    key={p.key}
                    cx="70"
                    cy="70"
                    r={R}
                    fill="none"
                    stroke={p.color}
                    strokeWidth="18"
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={offset}
                  >
                    <title>{`${p.label}: ${p.value} (${Math.round((p.value / total) * 100)}%)`}</title>
                  </circle>
                ) : null;
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{total}</span>
              <span className="text-xs text-slate-500">peserta</span>
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            {parts.map((p) => (
              <li key={p.key} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ background: p.color }}
                />
                <span className="flex-1 text-slate-600 leading-snug">
                  {p.label}
                </span>
                <span className="font-semibold text-slate-800">
                  {Math.round((p.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
