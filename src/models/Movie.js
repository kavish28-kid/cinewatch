"use strict";

const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      default: "",
      trim: true,
    },
    director: {
      type: String,
      default: "",
      trim: true,
    },
    cast: {
      type: [String],
      default: [],
    },
    posterUrl: {
      type: String,
      default: "",
      trim: true,
    },
    trailerUrl: {
      type: String,
      default: "",
      trim: true,
    },
    releaseYear: {
      type: Number,
      min: 1888,
    },
    runtimeMinutes: {
      type: Number,
      min: 1,
    },
    spokenLanguage: {
      type: String,
      default: "",
      trim: true,
    },
    imdbRating: {
      type: Number,
      min: 0,
      max: 10,
    },
    genres: {
      type: [String],
      default: [],
    },
    moodTags: {
      type: [String],
      default: [],
    },
    externalId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    source: {
      type: String,
      enum: ["manual", "tmdb", "imdb"],
      default: "manual",
    },
  },
  {
    timestamps: true,
  },
);

movieSchema.index({
  cast: "text",
  director: "text",
  moodTags: "text",
  overview: "text",
  title: "text",
});

module.exports = mongoose.model("Movie", movieSchema);
