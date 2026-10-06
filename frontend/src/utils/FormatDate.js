const fmt = (d) =>
  d
    ? new Date(`${String(d).slice(0, 10)}T00:00:00`).toLocaleDateString(
        "id-ID",
        { day: "numeric", month: "short", year: "numeric" },
      )
    : "";

export const formatPeriod = (start, end) =>
  start || end ? `${fmt(start)} – ${fmt(end)}` : "-";
