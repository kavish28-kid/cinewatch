"use strict";

const express = require("express");
const {
  addToWatchlist,
  getUserWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
} = require("../controllers/watchlistController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getUserWatchlist));
router.post("/", asyncHandler(addToWatchlist));
router.patch("/:watchlistId", asyncHandler(updateWatchlistItem));
router.delete("/users/:userId/movies/:movieId", asyncHandler(removeFromWatchlist));
router.delete("/:watchlistId", asyncHandler(removeFromWatchlist));

module.exports = router;
