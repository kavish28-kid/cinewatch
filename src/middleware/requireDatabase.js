"use strict";

const mongoose = require("mongoose");

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "database connection unavailable",
      details: "MongoDB Atlas is not reachable from the current network.",
    });
  }

  return next();
}

module.exports = requireDatabase;
