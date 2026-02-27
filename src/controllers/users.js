"use strict";
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

function safeUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, isAdmin: u.isAdmin, createdAt: u.createdAt };
}

// GET /users — admin: all users
async function listAll(_req, res, next) {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    res.json(users.map(safeUser));
  } catch (err) { next(err); }
}

// GET /users/:id
async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(safeUser(user));
  } catch (err) { next(err); }
}

// PATCH /users/:id — admin: update any field including isAdmin
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, phone, email, isAdmin, password } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (isAdmin !== undefined) data.isAdmin = Boolean(isAdmin);
    if (password) data.password = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({ where: { id }, data });
    res.json(safeUser(user));
  } catch (err) { next(err); }
}

// DELETE /users/:id — admin
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: "User not found" });
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { listAll, getOne, update, remove };
