import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { getDb, BOOKING_STATUSES } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireAdmin);

function loadBookingAdmin(db, bookingId) {
  const booking = db
    .prepare(
      `SELECT b.id, b.user_id AS userId, u.email AS userEmail, u.name AS userName,
              b.address_id AS addressId, b.status,
              b.pickup_slot_start AS pickupSlotStart, b.pickup_slot_end AS pickupSlotEnd,
              b.delivery_slot_start AS deliverySlotStart, b.delivery_slot_end AS deliverySlotEnd,
              b.notes, b.total_amount AS totalAmount, b.created_at AS createdAt, b.updated_at AS updatedAt,
              a.line1, a.line2, a.city, a.pincode, a.label AS addressLabel
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN addresses a ON a.id = b.address_id
       WHERE b.id = ?`
    )
    .get(bookingId);
  if (!booking) return null;
  const items = db
    .prepare(
      `SELECT bi.id, bi.service_id AS serviceId, s.name AS serviceName,
              bi.quantity, bi.unit, bi.unit_price AS unitPrice, bi.line_total AS lineTotal
       FROM booking_items bi
       JOIN services s ON s.id = bi.service_id
       WHERE bi.booking_id = ?`
    )
    .all(bookingId);
  const events = db
    .prepare(
      `SELECT id, status, message, created_at AS createdAt
       FROM status_events WHERE booking_id = ? ORDER BY id ASC`
    )
    .all(bookingId);
  return { ...booking, items, statusHistory: events };
}

router.get(
  "/bookings",
  query("status").optional().isString(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const status = req.query.status;
    let sql = `
      SELECT b.id, b.user_id AS userId, u.email AS userEmail, u.name AS userName,
             b.status, b.total_amount AS totalAmount,
             b.pickup_slot_start AS pickupSlotStart, b.created_at AS createdAt
      FROM bookings b
      JOIN users u ON u.id = b.user_id
    `;
    const params = [];
    if (status) {
      sql += ` WHERE b.status = ?`;
      params.push(status);
    }
    sql += ` ORDER BY b.id DESC LIMIT 200`;
    const rows = db.prepare(sql).all(...params);
    res.json(rows);
  }
);

router.get(
  "/bookings/:id",
  param("id").isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const booking = loadBookingAdmin(db, Number(req.params.id));
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  }
);

router.patch(
  "/bookings/:id/status",
  param("id").isInt(),
  body("status").isIn(BOOKING_STATUSES),
  body("message").optional().isString(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const id = Number(req.params.id);
    const { status, message } = req.body;
    const row = db.prepare(`SELECT id FROM bookings WHERE id = ?`).get(id);
    if (!row) return res.status(404).json({ error: "Booking not found" });
    const now = new Date().toISOString();
    db.prepare(`UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?`).run(
      status,
      now,
      id
    );
    db.prepare(
      `INSERT INTO status_events (booking_id, status, message, created_at)
       VALUES (?, ?, ?, ?)`
    ).run(id, status, message || null, now);
    const booking = loadBookingAdmin(db, id);
    res.json(booking);
  }
);

export default router;
