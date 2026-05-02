"use strict";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");
const requireDatabase = require("./middleware/requireDatabase");
const moviesRouter = require("./routes/movies");
const ratingsRouter = require("./routes/ratings");
const usersRouter = require("./routes/users");
const watchlistRouter = require("./routes/watchlist");

const app = express();

app.use(cors);
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    message: "Express server is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    status: "ok",
  });
});

app.use(
  "/api/movies",
  (req, res, next) => {
    if (req.method === "GET" && req.path === "/tmdb/search") {
      return next();
    }

    return requireDatabase(req, res, next);
  },
  moviesRouter,
);
app.use("/api/watchlist", requireDatabase, watchlistRouter);
app.use("/api/ratings", requireDatabase, ratingsRouter);
app.use("/api/users", requireDatabase, usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: "route not found" });
});

app.use(errorHandler);

module.exports = app;
