import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.get("/", (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, slug, name, description, unit, price_per_unit AS pricePerUnit FROM services ORDER BY id`
    )
    .all();
  res.json(rows);
});

export default router;
