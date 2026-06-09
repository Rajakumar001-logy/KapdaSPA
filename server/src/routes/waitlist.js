import { Router } from "express";
import { body, validationResult } from "express-validator";
import { getDb } from "../db.js";

const router = Router();

router.post(
  "/",
  body("email").isEmail().normalizeEmail(),
  body("city").trim().notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const { email, city } = req.body;
    const now = new Date().toISOString();
    try {
      db.prepare(
        `INSERT INTO waitlist (email, city, created_at) VALUES (?, ?, ?)`
      ).run(email, city, now);
    } catch (e) {
      if (!String(e).includes("UNIQUE")) {
        console.error(e);
      }
    }
    res.status(201).json({ ok: true });
  }
);

export default router;
