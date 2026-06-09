import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initDb, seedAdminIfConfigured } from "./db.js";
import authRoutes from "./routes/auth.js";
import servicesRoutes from "./routes/services.js";
import addressesRoutes from "./routes/addresses.js";
import bookingsRoutes from "./routes/bookings.js";
import waitlistRoutes from "./routes/waitlist.js";
import adminRoutes from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..", "..");

const app = express();
const PORT = Number(process.env.PORT) || 4000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.warn(
    "[warn] Set JWT_SECRET in server/.env (16+ characters). Auth will fail until fixed."
  );
}

app.use(cors());
app.use(express.json({ limit: "256kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/addresses", addressesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "vastra-care-api" });
});

app.use(express.static(rootDir));

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(404).type("text/plain").send("Not found");
});

initDb();
await seedAdminIfConfigured();

app.listen(PORT, () => {
  console.log(`VASTRA CARE API + static site → http://localhost:${PORT}`);
  console.log(`  Booking app: http://localhost:${PORT}/booking.html`);
});
