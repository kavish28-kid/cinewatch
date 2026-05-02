"use strict";

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "invalid id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({ error: "duplicate record" });
  }

  if (
    error.name === "MongooseServerSelectionError" ||
    error.name === "MongoNetworkError" ||
    error.message.includes("buffering timed out")
  ) {
    return res.status(503).json({
      error: "database connection unavailable",
      details: "Check MongoDB Atlas Network Access, database user credentials, and current network.",
    });
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "internal server error" : error.message;

  return res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
