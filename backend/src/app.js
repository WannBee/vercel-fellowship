import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

const allowed = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
    exposedHeaders: ["X-New-Token"],
  }),
);
app.use(express.json());
app.use("/api", routes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan server" });
});

export default app;
