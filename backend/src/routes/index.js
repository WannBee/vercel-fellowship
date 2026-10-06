import { Router } from "express";
import { validateParticipant } from "../middleware/validate.js";
import { auth, requireRole } from "../middleware/auth.js";
import * as a from "../controllers/authController.js";
import * as u from "../controllers/userController.js";
import * as p from "../controllers/participantController.js";
import * as pub from "../controllers/PublicController.js";

const r = Router();
const w = (fn) => (req, res, next) => fn(req, res).catch(next); // tangkap error async

// Auth
r.post("/auth/register", w(a.register));
r.post("/auth/login", w(a.login));
r.get("/auth/me", auth, w(a.me));

//route chart
r.get("/public/yearly", w(pub.yearly));

// Publik (tanpa login, hanya membaca)
r.get("/public/participants", w(pub.list));
r.get("/public/stats", w(pub.stats));

// Users
r.put("/users/profile", auth, w(u.updateProfile)); // harus di atas '/users/:id'
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
