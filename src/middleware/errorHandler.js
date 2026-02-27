"use strict";

/**
 * Global error handler middleware.
 * Must be registered LAST in the Express middleware chain.
 */
function errorHandler(err, _req, res, _next) {
  console.error("[ERROR]", err.message || err);

  // Prisma known errors
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ error: "A record with that value already exists" });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal server error",
  });
}

module.exports = errorHandler;
