"use strict";

const mongoose = require("mongoose");

function normalizeMongoUri(uri = "") {
  return String(uri)
    .trim()
    .replace(/^MONGODB_URI\s*=\s*/i, "")
    .replace(/^['"]|['"]$/g, "")
    .trim();
}

async function connectDatabase(uri = process.env.MONGODB_URI) {
  const normalizedUri = normalizeMongoUri(uri);

  if (!normalizedUri) {
    throw new Error("MONGODB_URI is required to connect to MongoDB");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(normalizedUri, {
    serverSelectionTimeoutMS: 30000,
  });
  return mongoose.connection;
}

module.exports = { connectDatabase, normalizeMongoUri };
