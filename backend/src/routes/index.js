import { Router } from "express";
import { validateParticipant } from "../middleware/validate.js";
import { auth, requireRole } from "../middleware/auth.js";
import * as a from "../controllers/authController.js";
import * as u from "../controllers/userController.js";
import * as p from "../controllers/participantController.js";
import { pool } from "../config/db.js";

const r = Router();
const w = (fn) => (req, res, next) => fn(req, res).catch(next); // tangkap error async

r.get("/health", async (_req, res) => {
  let target = "DATABASE_URL kosong";
  try {
    const u = new URL(process.env.DATABASE_URL);
    target = {
      host: u.hostname,
      port: u.port,
      user: u.username.split(".")[0] + (u.username.includes(".") ? ".…" : ""),
    };
  } catch {
    /* biarkan */
  }
  try {
    const t = await pool.query(
      "SELECT to_regclass('public.users') AS users_table, to_regclass('public.participants') AS participants_table",
    );
    res.json({
      db: "ok",
      target,
      ...t.rows[0],
      hasJwtSecret: !!process.env.JWT_SECRET,
    });
  } catch (e) {
    res.status(500).json({ db: "error", message: e.message, target });
  }
});

r.post("/auth/register", w(a.register));
r.post("/auth/login", w(a.login));
r.get("/auth/me", auth, w(a.me));

r.put("/users/profile", auth, w(u.updateProfile)); // harus di atas '/users/:id'
r.get("/users", auth, requireRole("admin"), w(u.list));
r.put("/users/:id", auth, requireRole("admin"), w(u.updateUser));
r.patch("/users/:id/role", auth, requireRole("admin"), w(u.updateRole));
r.delete("/users/:id", auth, requireRole("admin"), w(u.removeUser));

r.get("/participants/stats", auth, w(p.stats));
r.get("/participants", auth, w(p.list));
r.post("/participants", auth, validateParticipant, w(p.create));
r.put("/participants/:id", auth, validateParticipant, w(p.update));
r.delete("/participants/:id", auth, w(p.remove));
export default r;
