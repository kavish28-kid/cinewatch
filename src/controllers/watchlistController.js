"use strict";

const Movie = require("../models/Movie");
const User = require("../models/User");
const Watchlist = require("../models/Watchlist");
const createHttpError = require("../utils/httpError");

function getUserId(req) {
  return req.params.userId || req.body.userId || req.body.user;
}

function getMovieId(req) {
  return req.params.movieId || req.body.movieId || req.body.movie;
}

async function ensureUserAndMovie(userId, movieId) {
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
}

async function getUserWatchlist(req, res) {
  const userId = req.params.userId || req.query.userId;

  if (!userId) {
    throw createHttpError(400, "userId is required");
  }

  const watchlist = await Watchlist.find({ user: userId })
    .populate("movie")
    .sort({ createdAt: -1 });

  res.json({ watchlist });
}

async function addToWatchlist(req, res) {
  const userId = getUserId(req);
  const movieId = getMovieId(req);

  if (!userId || !movieId) {
    throw createHttpError(400, "userId and movieId are required");
  }

  await ensureUserAndMovie(userId, movieId);

  const item = await Watchlist.findOneAndUpdate(
    { user: userId, movie: movieId },
    {
      user: userId,
      movie: movieId,
      status: req.body.status || "planned",
      notes: req.body.notes || "",
    },
    { returnDocument: "after", runValidators: true, upsert: true },
  ).populate("movie");

  res.status(201).json({ item });
}

async function updateWatchlistItem(req, res) {
  const data = {};

  if (req.body.status !== undefined) data.status = req.body.status;
  if (req.body.notes !== undefined) data.notes = req.body.notes;

  const item = await Watchlist.findByIdAndUpdate(req.params.watchlistId, data, {
    returnDocument: "after",
    runValidators: true,
  }).populate("movie");

  if (!item) {
    throw createHttpError(404, "watchlist item not found");
  }

  res.json({ item });
}

async function removeFromWatchlist(req, res) {
  let item;

  if (req.params.watchlistId) {
    item = await Watchlist.findByIdAndDelete(req.params.watchlistId);
  } else {
    const userId = getUserId(req);
    const movieId = getMovieId(req);

    if (!userId || !movieId) {
      throw createHttpError(400, "userId and movieId are required");
    }

    item = await Watchlist.findOneAndDelete({ user: userId, movie: movieId });
  }

  if (!item) {
    throw createHttpError(404, "watchlist item not found");
  }

  res.status(204).send();
}

module.exports = {
  addToWatchlist,
  getUserWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
};
