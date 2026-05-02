"use strict";

const Movie = require("../models/Movie");
const Rating = require("../models/Rating");
const User = require("../models/User");
const createHttpError = require("../utils/httpError");

function getUserId(req) {
  return req.params.userId || req.body.userId || req.body.user;
}

function getMovieId(req) {
  return req.params.movieId || req.body.movieId || req.body.movie;
}

async function getUserRatings(req, res) {
  const userId = req.params.userId || req.query.userId;

  if (!userId) {
    throw createHttpError(400, "userId is required");
  }

  const ratings = await Rating.find({ user: userId })
    .populate("movie")
    .sort({ createdAt: -1 });

  res.json({ ratings });
}

async function addOrUpdateRating(req, res) {
  const userId = getUserId(req);
  const movieId = getMovieId(req);

  if (!userId || !movieId) {
    throw createHttpError(400, "userId and movieId are required");
  }

  const [user, movie] = await Promise.all([
    User.exists({ _id: userId }),
    Movie.exists({ _id: movieId }),
  ]);

  if (!user) {
    throw createHttpError(404, "user not found");
  }

  if (!movie) {
    throw createHttpError(404, "movie not found");
  }

  const rating = await Rating.findOneAndUpdate(
    { user: userId, movie: movieId },
    {
      user: userId,
      movie: movieId,
      score: req.body.score,
      review: req.body.review || "",
    },
    { returnDocument: "after", runValidators: true, upsert: true },
  ).populate("movie");

  res.status(201).json({ rating });
}

async function deleteRating(req, res) {
  const rating = await Rating.findByIdAndDelete(req.params.ratingId);

  if (!rating) {
    throw createHttpError(404, "rating not found");
  }

  res.status(204).send();
}

module.exports = {
  addOrUpdateRating,
  deleteRating,
  getUserRatings,
};
