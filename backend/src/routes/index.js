import { Router } from "express";
import { validateParticipant } from "../middleware/validate.js";
import { auth, requireRole } from "../middleware/auth.js";
import * as a from "../controllers/authController.js";
import * as u from "../controllers/userController.js";
import * as p from "../controllers/participantController.js";
import * as pub from "../controllers/PublicController.js";

const r = Router();
const w = (fn) => (req, res, next) => fn(req, res).catch(next); // tangkap error async

// Endpoint publik read-only boleh diakses dari origin mana pun. Dengan '*', respons yang
// di-cache CDN selalu memuat header CORS, siapa pun pemanggil pertamanya.
const openCors = (_req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
};

// Diagnosa sementara (tidak memakai database). Hapus setelah masalah selesai.
r.get("/ping", (req, res) =>
  res.json({
    ok: true,
    origin: req.headers.origin || null,
    clientUrlSet: !!process.env.CLIENT_URL,
  }),
);

// Auth
r.post("/auth/register", w(a.register));
r.post("/auth/login", w(a.login));
r.get("/auth/me", auth, w(a.me));
r.post("/auth/ping", auth, (_req, res) => res.status(204).end());

// Publik (tanpa login, hanya membaca)
r.get("/public/participants", openCors, w(pub.list));
r.get("/public/stats", openCors, w(pub.stats));
r.get("/public/yearly", openCors, w(pub.yearly));

// Users (rute tetap harus di atas '/users/:id')
r.put("/users/profile", auth, w(u.updateProfile));
r.put("/users/password", auth, w(u.changePassword));
r.get("/users", auth, requireRole("admin"), w(u.list));
r.put("/users/:id", auth, requireRole("admin"), w(u.updateUser));
r.patch("/users/:id/role", auth, requireRole("admin"), w(u.updateRole));
r.delete("/users/:id", auth, requireRole("admin"), w(u.removeUser));

// Partisipan
r.get("/participants/stats", auth, w(p.stats));
r.get("/participants", auth, w(p.list));
r.post("/participants", auth, validateParticipant, w(p.create));
r.put("/participants/:id", auth, validateParticipant, w(p.update));
r.delete("/participants/:id", auth, w(p.remove));

export default r;
