import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, label, line1, line2, city, pincode, created_at AS createdAt
       FROM addresses WHERE user_id = ? ORDER BY id DESC`
    )
    .all(req.user.sub);
  res.json(rows);
});

router.post(
  "/",
  body("line1").trim().notEmpty(),
  body("city").trim().notEmpty(),
  body("pincode").trim().notEmpty(),
  body("label").optional().trim(),
  body("line2").optional().trim(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const { label, line1, line2, city, pincode } = req.body;
    const now = new Date().toISOString();
    const info = db
      .prepare(
        `INSERT INTO addresses (user_id, label, line1, line2, city, pincode, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        req.user.sub,
        label || null,
        line1,
        line2 || null,
        city,
        pincode,
        now
      );
    const row = db
      .prepare(
        `SELECT id, label, line1, line2, city, pincode, created_at AS createdAt FROM addresses WHERE id = ?`
      )
      .get(info.lastInsertRowid);
    res.status(201).json(row);
  }
);

router.delete(
  "/:id",
  param("id").isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const id = Number(req.params.id);
    const info = db
      .prepare(`DELETE FROM addresses WHERE id = ? AND user_id = ?`)
      .run(id, req.user.sub);
    if (info.changes === 0) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.status(204).send();
  }
);

export default router;
