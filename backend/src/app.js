import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use("/api", routes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan server" });
});
export default app;
