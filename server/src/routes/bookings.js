import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function loadBooking(db, bookingId, userId) {
  const booking = db
    .prepare(
      `SELECT id, user_id AS userId, address_id AS addressId, status,
              pickup_slot_start AS pickupSlotStart, pickup_slot_end AS pickupSlotEnd,
              delivery_slot_start AS deliverySlotStart, delivery_slot_end AS deliverySlotEnd,
              notes, total_amount AS totalAmount, created_at AS createdAt, updated_at AS updatedAt
       FROM bookings WHERE id = ? AND user_id = ?`
    )
    .get(bookingId, userId);
  if (!booking) return null;
  const items = db
    .prepare(
      `SELECT bi.id, bi.service_id AS serviceId, s.name AS serviceName, s.slug AS serviceSlug,
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

router.get("/", (req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, status, total_amount AS totalAmount,
              pickup_slot_start AS pickupSlotStart, pickup_slot_end AS pickupSlotEnd,
              created_at AS createdAt, updated_at AS updatedAt
       FROM bookings WHERE user_id = ? ORDER BY id DESC`
    )
    .all(req.user.sub);
  res.json(rows);
});

router.post(
  "/",
  body("addressId").isInt(),
  body("pickupSlotStart").isISO8601(),
  body("pickupSlotEnd").isISO8601(),
  body("deliverySlotStart").optional().isISO8601(),
  body("deliverySlotEnd").optional().isISO8601(),
  body("notes").optional().isString(),
  body("items").isArray({ min: 1 }),
  body("items.*.serviceId").isInt(),
  body("items.*.quantity").isFloat({ gt: 0 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const {
      addressId,
      pickupSlotStart,
      pickupSlotEnd,
      deliverySlotStart,
      deliverySlotEnd,
      notes,
      items,
    } = req.body;

    const addr = db
      .prepare(`SELECT id FROM addresses WHERE id = ? AND user_id = ?`)
      .get(addressId, req.user.sub);
    if (!addr) {
      return res.status(400).json({ error: "Invalid address" });
    }

    const serviceStmt = db.prepare(
      `SELECT id, unit, price_per_unit FROM services WHERE id = ?`
    );
    let total = 0;
    const resolved = [];
    for (const line of items) {
      const svc = serviceStmt.get(line.serviceId);
      if (!svc) {
        return res.status(400).json({ error: `Unknown service: ${line.serviceId}` });
      }
      const qty = Number(line.quantity);
      const lineTotal = Math.round(svc.price_per_unit * qty * 100) / 100;
      total += lineTotal;
      resolved.push({
        serviceId: svc.id,
        quantity: qty,
        unit: svc.unit,
        unitPrice: svc.price_per_unit,
        lineTotal,
      });
    }
    total = Math.round(total * 100) / 100;
    const now = new Date().toISOString();

    const insertBooking = db.prepare(
      `INSERT INTO bookings (
        user_id, address_id, status, pickup_slot_start, pickup_slot_end,
        delivery_slot_start, delivery_slot_end, notes, total_amount, created_at, updated_at
      ) VALUES (?, ?, 'placed', ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const insertItem = db.prepare(
      `INSERT INTO booking_items (booking_id, service_id, quantity, unit, unit_price, line_total)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const insertEvent = db.prepare(
      `INSERT INTO status_events (booking_id, status, message, created_at)
       VALUES (?, 'placed', ?, ?)`
    );

    let bookingId;
    const tx = db.transaction(() => {
      const info = insertBooking.run(
        req.user.sub,
        addressId,
        pickupSlotStart,
        pickupSlotEnd,
        deliverySlotStart || null,
        deliverySlotEnd || null,
        notes || null,
        total,
        now,
        now
      );
      bookingId = info.lastInsertRowid;
      for (const r of resolved) {
        insertItem.run(
          bookingId,
          r.serviceId,
          r.quantity,
          r.unit,
          r.unitPrice,
          r.lineTotal
        );
      }
      insertEvent.run(bookingId, "Order received", now);
    });
    try {
      tx();
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Could not create booking" });
    }

    const booking = loadBooking(db, bookingId, req.user.sub);
    res.status(201).json(booking);
  }
);

router.get(
  "/:id",
  param("id").isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const booking = loadBooking(db, Number(req.params.id), req.user.sub);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  }
);

router.patch(
  "/:id/cancel",
  param("id").isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const db = getDb();
    const id = Number(req.params.id);
    const row = db
      .prepare(`SELECT status FROM bookings WHERE id = ? AND user_id = ?`)
      .get(id, req.user.sub);
    if (!row) return res.status(404).json({ error: "Booking not found" });
    if (["delivered", "cancelled"].includes(row.status)) {
      return res.status(400).json({ error: "Cannot cancel this booking" });
    }
    const now = new Date().toISOString();
    db.prepare(
      `UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ?`
    ).run(now, id);
    db.prepare(
      `INSERT INTO status_events (booking_id, status, message, created_at)
       VALUES (?, 'cancelled', 'Cancelled by customer', ?)`
    ).run(id, now);
    const booking = loadBooking(db, id, req.user.sub);
    res.json(booking);
  }
);

export default router;
