"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const mongoose = require("mongoose");

const Movie = require("../src/models/Movie");
const Rating = require("../src/models/Rating");
const User = require("../src/models/User");
const Watchlist = require("../src/models/Watchlist");

function objectId() {
  return new mongoose.Types.ObjectId();
}

test("user schema requires valid identity fields", () => {
  const user = new User({
    name: "Ada Lovelace",
    email: "ada@example.com",
    passwordHash: "hashed-password",
  });

  assert.equal(user.validateSync(), undefined);

  const invalidUser = new User({
    name: "",
    email: "not-an-email",
    passwordHash: "",
  });

  const error = invalidUser.validateSync();

  assert.ok(error.errors.name);
  assert.ok(error.errors.email);
  assert.ok(error.errors.passwordHash);
});

test("movie schema validates required movie fields", () => {
  const movie = new Movie({
    title: "Inception",
    releaseYear: 2010,
    genres: ["Sci-Fi", "Thriller"],
  });

  assert.equal(movie.validateSync(), undefined);

  const invalidMovie = new Movie({
    title: "",
    releaseYear: 1800,
    source: "unknown",
  });

  const error = invalidMovie.validateSync();

  assert.ok(error.errors.title);
  assert.ok(error.errors.releaseYear);
  assert.ok(error.errors.source);
});

test("watchlist schema links one user to one movie", () => {
  const item = new Watchlist({
    user: objectId(),
    movie: objectId(),
    status: "planned",
  });

  assert.equal(item.validateSync(), undefined);

  const invalidItem = new Watchlist({
    status: "paused",
  });

  const error = invalidItem.validateSync();

  assert.ok(error.errors.user);
  assert.ok(error.errors.movie);
  assert.ok(error.errors.status);
});

test("rating schema validates user, movie, and score", () => {
  const rating = new Rating({
    user: objectId(),
    movie: objectId(),
    score: 9,
    review: "Strong rewatch value",
  });

  assert.equal(rating.validateSync(), undefined);

  const invalidRating = new Rating({
    score: 11,
  });

  const error = invalidRating.validateSync();

  assert.ok(error.errors.user);
  assert.ok(error.errors.movie);
  assert.ok(error.errors.score);
});
