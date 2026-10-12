import jwt from "jsonwebtoken";

// Masa berlaku token. Sengaja 15 menit lebih panjang dari batas idle di frontend (2 jam),
// karena perpanjangan token terjadi berkala, bukan di setiap detik aktivitas.
const TTL = process.env.SESSION_TTL || "135m";

export const auth = (req, res, next) => {
  const t = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    const p = jwt.verify(t, process.env.JWT_SECRET);
    req.user = p;
    // Sliding session: kalau token sudah lebih dari 10 menit sejak diterbitkan, kirim token baru
    if (Date.now() / 1000 - p.iat > 600) {
      const fresh = jwt.sign(
        { id: p.id, role: p.role },
        process.env.JWT_SECRET,
        { expiresIn: TTL },
      );
      res.setHeader("X-New-Token", fresh);
    }
    next();
  } catch (e) {
    res.status(401).json({
      message:
        e.name === "TokenExpiredError"
          ? "Sesi berakhir, silakan login kembali"
          : "Unauthorized",
    });
  }
};

export const requireRole = (role) => (req, res, next) =>
  req.user.role === role
    ? next()
    : res.status(403).json({ message: "Forbidden" });
