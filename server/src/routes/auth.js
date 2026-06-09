import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set (16+ characters)");
  }
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );
}

router.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("name").trim().notEmpty(),
  body("phone").optional().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const { email, password, name, phone } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    try {
      const info = db
        .prepare(
          `INSERT INTO users (email, password_hash, name, phone, role, created_at)
           VALUES (?, ?, ?, ?, 'customer', ?)`
        )
        .run(email, password_hash, name, phone || null, now);
      const user = {
        id: info.lastInsertRowid,
        email,
        name,
        phone: phone || null,
        role: "customer",
      };
      let token;
      try {
        token = signToken(user);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server misconfiguration" });
      }
      return res.status(201).json({ token, user });
    } catch (e) {
      if (String(e).includes("UNIQUE")) {
        return res.status(409).json({ error: "Email already registered" });
      }
      console.error(e);
      return res.status(500).json({ error: "Could not register" });
    }
  }
);

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const { email, password } = req.body;
    const row = db
      .prepare(
        `SELECT id, email, password_hash, name, phone, role FROM users WHERE email = ?`
      )
      .get(email);
    if (!row) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const user = {
      id: row.id,
      email: row.email,
      name: row.name,
      phone: row.phone,
      role: row.role,
    };
    let token;
    try {
      token = signToken(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server misconfiguration" });
    }
    return res.json({ token, user });
  }
);

router.get("/me", requireAuth, (req, res) => {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?`
    )
    .get(req.user.sub);
  if (!row) return res.status(404).json({ error: "User not found" });
  return res.json(row);
});

export default router;
