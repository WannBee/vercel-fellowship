const STATUS = ["telah lulus", "sedang pendidikan", "cuti", "akan pendidikan"];
const REQUIRED = [
  "name",
  "ksm",
  "hospital",
  "province",
  "fellowship",
  "funding",
  "period_start",
  "period_end",
];
const isDate = (s) =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

export const validateParticipant = (req, res, next) => {
  const b = req.body;
  const missing = REQUIRED.filter((k) => !String(b[k] ?? "").trim());
  if (missing.length)
    return res
      .status(400)
      .json({ message: `Field wajib diisi: ${missing.join(", ")}` });
  if (!STATUS.includes(b.status))
    return res.status(400).json({ message: "Status tidak valid" });
  if (String(b.funding).length > 100)
    return res.status(400).json({ message: "Sumber biaya terlalu panjang" });
  if (!isDate(b.period_start) || !isDate(b.period_end))
    return res
      .status(400)
      .json({ message: "Format tanggal periode tidak valid" });
  if (b.period_end < b.period_start)
    return res
      .status(400)
      .json({ message: "Tanggal selesai tidak boleh sebelum tanggal mulai" });
  next();
};
