/**
 * Entry point — Rent-A-Room Express server
 * Swagger UI: http://localhost:3000/api-docs
 */
"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const listingsRouter = require("./routes/listings");
const authRouter = require("./routes/auth");
const messagesRouter = require("./routes/messages");
const usersRouter = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Rate limiters ─────────────────────────────────────────────────
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false, message: { error: "Too many requests, please try again later." } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { error: "Too many auth attempts, please try again later." } });

// ── Multer (disk storage for listing images) ──────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `listing_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

// ── Swagger Definition ────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Rent-A-Room API", version: "2.0.0", description: "Express + PostgreSQL + Prisma + JWT" },
    tags: [
      { name: "Listings", description: "Room/property CRUD" },
      { name: "Auth", description: "Register, login, profile (JWT)" },
      { name: "Users", description: "Admin user management" },
      { name: "Messages", description: "Booking/contact requests" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        I18nString: {
          type: "object",
          properties: {
            en: { type: "string" }, ru: { type: "string" }, tj: { type: "string" },
          },
        },
        Listing: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { $ref: "#/components/schemas/I18nString" },
            location: { $ref: "#/components/schemas/I18nString" },
            type: { $ref: "#/components/schemas/I18nString" },
            rooms: { type: "integer" }, price: { type: "integer" },
            about: { type: "string" }, image: { type: "string" }, createdAt: { type: "string" },
          },
        },
        Error: { type: "object", properties: { error: { type: "string" } } },
      },
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: "Local" },
      { url: "https://your-app.up.railway.app", description: "Production" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ── Middleware ────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("dev"));
app.use(generalLimiter);
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ── Swagger UI ────────────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Rent-A-Room API Docs",
  customCss: ".swagger-ui .topbar { background-color: #059669; }",
}));
app.get("/api-docs.json", (_req, res) => { res.setHeader("Content-Type","application/json"); res.send(swaggerSpec); });

// ── Health check ──────────────────────────────────────────────────
app.get("/", (_req, res) => res.json({ status: "ok", service: "rent-a-room-api", version: "2.1.0", docs: `/api-docs` }));

// ── Routes ────────────────────────────────────────────────────────
app.use("/listings", (req, res, next) => {
  if ((req.method === "POST" || req.method === "PUT" || req.method === "PATCH") &&
      req.headers["content-type"]?.includes("multipart/form-data")) {
    upload.single("image")(req, res, next);
  } else {
    next();
  }
}, listingsRouter);

app.use("/auth", authLimiter, authRouter);
app.use("/messages", messagesRouter);
app.use("/users", usersRouter);

// ── 404 ───────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// ── Global error handler ──────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────
const fs = require("fs");
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.listen(PORT, () => {
  console.log(`✅  Rent-A-Room API  →  http://localhost:${PORT}`);
  console.log(`📖  Swagger UI      →  http://localhost:${PORT}/api-docs`);
  console.log(`👤  JWT auth active  →  POST /auth/login`);
});

module.exports = app;
