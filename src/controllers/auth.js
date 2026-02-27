"use strict";
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || "rentaroom_super_secret_key_2026";
const EXPIRES = "7d";

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, SECRET, { expiresIn: EXPIRES });
}

function safeUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, isAdmin: u.isAdmin, createdAt: u.createdAt };
}

async function register(req, res, next) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "name, email and password are required" });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, phone: phone || "", password: hash } });
    res.status(201).json({ user: safeUser(user), token: makeToken(user) });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password are required" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });
    res.json({ user: safeUser(user), token: makeToken(user) });
  } catch (err) { next(err); }
}

async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(safeUser(user));
  } catch (err) { next(err); }
}

async function updateMe(req, res, next) {
  try {
    const { name, phone } = req.body;
    const data = {};
    if (name) data.name = name;
    if (phone !== undefined) data.phone = phone;
    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    res.json(safeUser(user));
  } catch (err) { next(err); }
}

module.exports = { register, login, getMe, updateMe };
