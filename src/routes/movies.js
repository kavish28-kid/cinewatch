"use strict";

const express = require("express");
const {
  createMovie,
  deleteMovie,
  getAiRecommendations,
  getDiscoveryRecommendations,
  getMovie,
  getMovieStats,
  getMovieTrailer,
  getMovies,
  getRandomMovie,
  getRecommendations,
  getSimilarMovies,
  getWorldRandomMovie,
  getWorldRecommendations,
  importTmdbMovie,
  searchTmdbMovies,
} = require("../controllers/movieController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getMovies));
router.post("/", asyncHandler(createMovie));
router.get("/ai", asyncHandler(getAiRecommendations));
router.get("/discover", asyncHandler(getDiscoveryRecommendations));
router.get("/random", asyncHandler(getRandomMovie));
router.get("/recommendations", asyncHandler(getRecommendations));
router.get("/tmdb/search", asyncHandler(searchTmdbMovies));
router.post("/tmdb/:tmdbId/import", asyncHandler(importTmdbMovie));
router.get("/world", asyncHandler(getWorldRecommendations));
router.get("/world/random", asyncHandler(getWorldRandomMovie));
router.get("/:movieId/trailer", asyncHandler(getMovieTrailer));
router.get("/:movieId", asyncHandler(getMovie));
router.delete("/:movieId", asyncHandler(deleteMovie));
router.get("/:movieId/similar", asyncHandler(getSimilarMovies));
router.get("/:movieId/stats", asyncHandler(getMovieStats));

module.exports = router;
