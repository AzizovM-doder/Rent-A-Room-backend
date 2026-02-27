"use strict";

const { Router } = require("express");
const ctrl = require("../controllers/listings");

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Listings
 *   description: Room/property listings CRUD
 */

/**
 * @openapi
 * /listings:
 *   get:
 *     tags: [Listings]
 *     summary: Get all listings
 *     description: Returns all listings ordered by newest first.
 *     responses:
 *       200:
 *         description: Array of listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/stats", ctrl.stats);
router.get("/:id", ctrl.getById);
router.get("/", ctrl.listAll);

/**
 * @openapi
 * /listings:
 *   post:
 *     tags: [Listings]
 *     summary: Create a new listing
 *     description: |
 *       Creates a new room/property listing. The `name`, `location`, and `type`
 *       fields must be nested multilingual objects `{ en, ru, tj }`.
 *       The `image` field accepts either a URL or a base64 data URI.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateListing'
 *           example:
 *             name:
 *               en: "Modern Apartment"
 *               ru: "Современная квартира"
 *               tj: "Хонаи муосир"
 *             location:
 *               en: "Dushanbe"
 *               ru: "Душанбе"
 *               tj: "Душанбе"
 *             type:
 *               en: "apartment"
 *               ru: "квартира"
 *               tj: "хона"
 *             rooms: 2
 *             price: 35
 *             about: "Clean modern apartment in the city center."
 *             image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
 *     responses:
 *       201:
 *         description: Created listing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", ctrl.create);

/**
 * @openapi
 * /listings/{id}:
 *   put:
 *     tags: [Listings]
 *     summary: Update a listing (full replace)
 *     description: Updates an existing listing by ID. Accepts partial bodies too.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateListing'
 *     responses:
 *       200:
 *         description: Updated listing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", ctrl.update);

/**
 * @openapi
 * /listings/{id}:
 *   patch:
 *     tags: [Listings]
 *     summary: Partially update a listing
 *     description: Same as PUT but semantically for partial updates.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateListing'
 *     responses:
 *       200:
 *         description: Updated listing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id", ctrl.update);

/**
 * @openapi
 * /listings/{id}:
 *   delete:
 *     tags: [Listings]
 *     summary: Delete a listing
 *     description: Permanently deletes a listing. Returns 204 No Content on success.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Listing ID
 *     responses:
 *       204:
 *         description: Deleted successfully (no body)
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", ctrl.remove);

module.exports = router;
