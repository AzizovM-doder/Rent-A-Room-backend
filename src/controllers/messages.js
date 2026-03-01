"use strict";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// POST /messages
async function create(req, res, next) {
  try {
    const { listingId, userId, name, phone, message, days } = req.body;
    if (!listingId || !name || !phone || !message)
      return res.status(400).json({ error: "listingId, name, phone, message are required" });
    const msg = await prisma.message.create({
      data: {
        listingId: Number(listingId),
        userId: userId ? Number(userId) : null,
        name: String(name), phone: String(phone), message: String(message),
        days: Number(days || 1),
      },
    });
    res.status(201).json(msg);
  } catch (err) { next(err); }
}

// GET /messages (admin)
async function listAll(_req, res, next) {
  try {
    const msgs = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: { listing: { select: { id: true, nameEn: true, price: true } }, user: { select: { id: true, name: true, email: true } } },
    });
    res.json(msgs);
  } catch (err) { next(err); }
}

// PATCH /messages/:id — change status (admin)
async function updateStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status))
      return res.status(400).json({ error: "status must be PENDING, ACCEPTED or REJECTED" });
    const msg = await prisma.message.update({ where: { id }, data: { status } });
    res.json(msg);
  } catch (err) { next(err); }
}

// DELETE /messages/:id (admin)
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Message not found" });
    await prisma.message.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { create, listAll, updateStatus, remove };
