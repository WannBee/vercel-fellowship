import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  const t = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    req.user = jwt.verify(t, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
export const requireRole = (role) => (req, res, next) =>
  req.user.role === role
    ? next()
    : res.status(403).json({ message: "Forbidden" });
