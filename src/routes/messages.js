"use strict";
const { Router } = require("express");
const ctrl = require("../controllers/messages");
const authMiddleware = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const router = Router();

/**
 * @openapi
 * /messages:
 *   post:
 *     tags: [Messages]
 *     summary: Submit a booking request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [listingId, name, phone, message]
 *             properties:
 *               listingId: { type: integer }
 *               userId: { type: integer, nullable: true }
 *               name: { type: string }
 *               phone: { type: string }
 *               message: { type: string }
 *               days: { type: integer, default: 1 }
 */
router.post("/", ctrl.create);

/**
 * @openapi
 * /messages:
 *   get:
 *     tags: [Messages]
 *     summary: List all booking requests (admin only)
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, adminOnly, ctrl.listAll);

/**
 * @openapi
 * /messages/{id}:
 *   patch:
 *     tags: [Messages]
 *     summary: Update message status — PENDING | ACCEPTED | REJECTED (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ACCEPTED, REJECTED]
 */
router.patch("/:id", authMiddleware, adminOnly, ctrl.updateStatus);

module.exports = router;
