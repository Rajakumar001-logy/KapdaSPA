import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

export const BOOKING_STATUSES = [
  "placed",
  "confirmed",
  "pickup_scheduled",
  "picked_up",
  "processing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

let db;

export function getDb() {
  if (!db) throw new Error("Database not initialized");
  return db;
}

export function initDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "app.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      label TEXT,
      line1 TEXT NOT NULL,
      line2 TEXT,
      city TEXT NOT NULL,
      pincode TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      unit TEXT NOT NULL CHECK (unit IN ('kg','piece')),
      price_per_unit REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      address_id INTEGER NOT NULL REFERENCES addresses(id),
      status TEXT NOT NULL,
      pickup_slot_start TEXT NOT NULL,
      pickup_slot_end TEXT NOT NULL,
      delivery_slot_start TEXT,
      delivery_slot_end TEXT,
      notes TEXT,
      total_amount REAL NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS booking_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      service_id INTEGER NOT NULL REFERENCES services(id),
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      unit_price REAL NOT NULL,
      line_total REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS status_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      message TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL COLLATE NOCASE,
      city TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  seedServices();
}

function seedServices() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM services").get().c;
  if (count > 0) return;

  const insert = db.prepare(
    `INSERT INTO services (slug, name, description, unit, price_per_unit) VALUES (@slug, @name, @description, @unit, @price)`
  );
  const rows = [
    {
      slug: "wash-fold",
      name: "Wash & fold",
      description: "Everyday laundry, sorted and folded.",
      unit: "kg",
      price: 89,
    },
    {
      slug: "dry-clean",
      name: "Dry cleaning",
      description: "Suits, silks, and delicate fabrics.",
      unit: "piece",
      price: 149,
    },
    {
      slug: "press-steam",
      name: "Press & steam",
      description: "Crisp finish for shirts and dresses.",
      unit: "piece",
      price: 79,
    },
    {
      slug: "stain-care",
      name: "Stain treatment",
      description: "Targeted spot treatment add-on.",
      unit: "piece",
      price: 49,
    },
  ];
  const tx = db.transaction(() => {
    for (const r of rows) {
      insert.run({
        slug: r.slug,
        name: r.name,
        description: r.description,
        unit: r.unit,
        price: r.price,
      });
    }
  });
  tx();
}

export async function seedAdminIfConfigured() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) return;

  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) return;

  const password_hash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO users (email, password_hash, name, phone, role, created_at)
     VALUES (?, ?, ?, NULL, 'admin', ?)`
  ).run(email, password_hash, "Admin", now);
  console.log("[db] Seeded admin user:", email);
}
