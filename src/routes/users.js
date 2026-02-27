"use strict";
const { Router } = require("express");
const ctrl = require("../controllers/users");
const authMiddleware = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const router = Router();

// All user routes require auth + admin (except noted)
router.use(authMiddleware, adminOnly);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin only)
 *     security:
 *       - bearerAuth: []
 */
router.get("/", ctrl.listAll);
router.get("/:id", ctrl.getOne);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user (admin only) — can set isAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 */
router.patch("/:id", ctrl.update);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (admin only)
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", ctrl.remove);

module.exports = router;
