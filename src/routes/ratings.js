"use strict";

const express = require("express");
const {
  addOrUpdateRating,
  deleteRating,
  getUserRatings,
} = require("../controllers/ratingController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getUserRatings));
router.post("/", asyncHandler(addOrUpdateRating));
router.delete("/:ratingId", asyncHandler(deleteRating));

module.exports = router;
