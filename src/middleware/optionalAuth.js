"use strict";
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "rentaroom_super_secret_key_2026";

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, SECRET);
  } catch {
    req.user = null;
  }
  next();
}

module.exports = optionalAuth;
