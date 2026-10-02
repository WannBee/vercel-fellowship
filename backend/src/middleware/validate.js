const STATUS = ["telah lulus", "sedang pendidikan", "cuti", "akan pendidikan"];
const REQUIRED = [
  "name",
  "email",
  "phone",
  "ksm",
  "hospital",
  "province",
  "fellowship",
  "period",
];
export const validateParticipant = (req, res, next) => {
  const b = req.body;
  const missing = REQUIRED.filter((k) => !String(b[k] ?? "").trim());
  if (missing.length)
    return res
      .status(400)
      .json({ message: `Field wajib diisi: ${missing.join(", ")}` });
  if (!/^\S+@\S+\.\S+$/.test(b.email))
    return res.status(400).json({ message: "Format email tidak valid" });
  if (!STATUS.includes(b.status))
    return res.status(400).json({ message: "Status tidak valid" });
  next();
};
