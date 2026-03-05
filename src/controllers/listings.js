"use strict";

/**
 * Listings Controller
 * Images are now uploaded via multipart/form-data (multer).
 * The DB stores the relative path ("uploads/filename.jpg").
 * Multilingual fields (name, location, type) are sent as JSON strings in FormData.
 */

const { PrismaClient } = require("@prisma/client");
const path = require("path");
const prisma = new PrismaClient();

// ── Helpers ───────────────────────────────────────────────────────

function serialize(row) {
  const imageUrl = row.image
    ? row.image.startsWith("http") || row.image.startsWith("data:")
      ? row.image
      : `${process.env.BASE_URL || "https://rent-a-room-backend-production.up.railway.app"}/${row.image}`
    : "";

  const result = {
    id: row.id,
    name: { en: row.nameEn, ru: row.nameRu, tj: row.nameTj },
    location: { en: row.locationEn, ru: row.locationRu, tj: row.locationTj },
    type: { en: row.typeEn, ru: row.typeRu, tj: row.typeTj },
    rooms: row.rooms,
    price: row.price,
    about: row.about,
    image: imageUrl,
    createdAt: row.createdAt,
    status: row.status,
    userId: row.userId,
  };
  if (row.user) {
    result.user = { id: row.user.id, name: row.user.name, email: row.user.email, phone: row.user.phone };
  }
  return result;
}

function parseI18n(raw) {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try { return JSON.parse(raw); } catch { return { en: raw, ru: raw, tj: raw }; }
}

function flatten(body, file) {
  const data = {};

  // Multilingual fields — accept JSON string OR nested object
  const name = parseI18n(body.name);
  const location = parseI18n(body.location);
  const type = parseI18n(body.type);

  if (name.en !== undefined) data.nameEn = String(name.en);
  if (name.ru !== undefined) data.nameRu = String(name.ru);
  if (name.tj !== undefined) data.nameTj = String(name.tj);

  if (location.en !== undefined) data.locationEn = String(location.en);
  if (location.ru !== undefined) data.locationRu = String(location.ru);
  if (location.tj !== undefined) data.locationTj = String(location.tj);

  if (type.en !== undefined) data.typeEn = String(type.en);
  if (type.ru !== undefined) data.typeRu = String(type.ru);
  if (type.tj !== undefined) data.typeTj = String(type.tj);

  // Flat fields
  ["nameEn","nameRu","nameTj","locationEn","locationRu","locationTj","typeEn","typeRu","typeTj"]
    .forEach(k => { if (body[k] !== undefined) data[k] = String(body[k]); });

  if (body.rooms !== undefined) data.rooms = Number(body.rooms);
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.about !== undefined) data.about = String(body.about ?? "");

  // Image — from multer file OR legacy base64/URL string
  if (file) {
    data.image = `uploads/${file.filename}`;
  } else if (body.image !== undefined) {
    data.image = String(body.image);
  }

  return data;
}

// ── Controllers ───────────────────────────────────────────────────

async function listAll(req, res, next) {
  try {
    const isAdmin = req.user && req.user.isAdmin;
    const where = isAdmin ? {} : { status: "ACCEPTED" };
    const rows = await prisma.listing.findMany({ 
      where, 
      orderBy: { createdAt: "desc" },
      include: { user: true }
    });
    res.json(rows.map(serialize));
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const row = await prisma.listing.findUnique({ 
      where: { id },
      include: { user: true } 
    });
    if (!row) return res.status(404).json({ error: "Listing not found" });
    
    // Only admins or the owner can see pending/rejected listings
    const isAdmin = req.user && req.user.isAdmin;
    const isOwner = req.user && req.user.id === row.userId;
    if (row.status !== "ACCEPTED" && !isAdmin && !isOwner) {
      return res.status(403).json({ error: "Listing is pending approval or rejected" });
    }
    
    res.json(serialize(row));
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = flatten(req.body, req.file);

    if (!data.nameEn) return res.status(400).json({ error: "name.en is required" });
    if (!data.locationEn) return res.status(400).json({ error: "location.en is required" });
    if (!data.typeEn) return res.status(400).json({ error: "type.en is required" });
    if (isNaN(data.rooms)) return res.status(400).json({ error: "rooms must be a number" });
    if (isNaN(data.price)) return res.status(400).json({ error: "price must be a number" });

    // Auto-approve if created by admin. Otherwise PENDING.
    const isAdmin = req.user && req.user.isAdmin;
    const status = isAdmin ? "ACCEPTED" : "PENDING";

    const row = await prisma.listing.create({
      data: {
        nameEn: data.nameEn, nameRu: data.nameRu ?? "", nameTj: data.nameTj ?? "",
        locationEn: data.locationEn, locationRu: data.locationRu ?? "", locationTj: data.locationTj ?? "",
        typeEn: data.typeEn, typeRu: data.typeRu ?? "", typeTj: data.typeTj ?? "",
        rooms: data.rooms, price: data.price,
        about: data.about ?? "", image: data.image ?? "",
        status,
        userId: req.user ? req.user.id : null,
      },
      include: { user: true }
    });
    res.status(201).json(serialize(row));
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const data = flatten(req.body, req.file);
    if (Object.keys(data).length === 0) return res.status(400).json({ error: "No fields to update" });

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Listing not found" });

    const row = await prisma.listing.update({ where: { id }, data });
    res.json(serialize(row));
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Listing not found" });
    
    const isAdmin = req.user && req.user.isAdmin;
    if (!isAdmin && existing.userId !== req.user.id) {
       return res.status(403).json({ error: "Forbidden: Not owner or admin" });
    }

    await prisma.listing.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: "Forbidden: Admins only" });

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { status } = req.body;
    if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const row = await prisma.listing.update({ 
      where: { id }, 
      data: { status },
      include: { user: true }
    });
    res.json(serialize(row));
  } catch (err) { next(err); }
}

async function stats(_req, res, next) {
  try {
    const rows = await prisma.listing.findMany({
      where: { status: "ACCEPTED" },
      select: { locationEn: true, typeEn: true, price: true },
    });
    const total = rows.length;
    const cities = [...new Set(rows.map((r) => r.locationEn).filter(Boolean))];
    const types  = [...new Set(rows.map((r) => r.typeEn).filter(Boolean))];
    const prices = rows.map((r) => r.price).filter((p) => p != null);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    res.json({ total, cities, types, minPrice, maxPrice });
  } catch (err) { next(err); }
}

module.exports = { listAll, getById, stats, create, update, updateStatus, remove };
