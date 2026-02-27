"use strict";
const { Router } = require("express");
const ctrl = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");
const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: "{ user, token }"
 */
router.post("/register", ctrl.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login — returns JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: "{ user, token }"
 */
router.post("/login", ctrl.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get own profile (requires Bearer token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User object
 */
router.get("/me", authMiddleware, ctrl.getMe);

/**
 * @openapi
 * /auth/me:
 *   patch:
 *     tags: [Auth]
 *     summary: Update own name/phone (requires Bearer token)
 *     security:
 *       - bearerAuth: []
 */
router.patch("/me", authMiddleware, ctrl.updateMe);

module.exports = router;
