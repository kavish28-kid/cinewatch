"use strict";

const Movie = require("../models/Movie");
const Rating = require("../models/Rating");
const Watchlist = require("../models/Watchlist");
const tmdbService = require("../services/tmdbService");
const createHttpError = require("../utils/httpError");

const promptGenreAliases = new Map([
  ["action", "Action"],
  ["adventure", "Adventure"],
  ["animated", "Animation"],
  ["animation", "Animation"],
  ["cartoon", "Animation"],
  ["comedy", "Comedy"],
  ["comic", "Comedy"],
  ["crime", "Crime"],
  ["documentary", "Documentary"],
  ["drama", "Drama"],
  ["family", "Family"],
  ["fantasy", "Fantasy"],
  ["horror", "Horror"],
  ["mystery", "Mystery"],
  ["music", "Music"],
  ["romance", "Romance"],
  ["romantic", "Romance"],
  ["sci fi", "Sci-Fi"],
  ["sci-fi", "Sci-Fi"],
  ["science fiction", "Sci-Fi"],
  ["sport", "Sports"],
  ["sports", "Sports"],
  ["thriller", "Thriller"],
  ["war", "War"],
]);

const promptMoodAliases = new Map([
  ["clever", "clever"],
  ["college", "college"],
  ["dark", "dark"],
  ["dreamy", "dreamy"],
  ["emotional", "emotional"],
  ["epic", "epic"],
  ["family", "family"],
  ["fun", "fun"],
  ["funny", "fun"],
  ["happy", "fun"],
  ["heroic", "heroic"],
  ["inspiring", "inspiring"],
  ["inspirational", "inspiring"],
  ["intense", "intense"],
  ["mind bending", "mind-bending"],
  ["mind-bending", "mind-bending"],
  ["romantic", "romantic"],
  ["sad", "emotional"],
  ["thoughtful", "thoughtful"],
]);

async function getStatsForMovieIds(movieIds) {
  const [watchlistStats, ratingStats] = await Promise.all([
    Watchlist.aggregate([
      { $match: { movie: { $in: movieIds } } },
      { $group: { _id: "$movie", watchlistCount: { $sum: 1 } } },
    ]),
    Rating.aggregate([
      { $match: { movie: { $in: movieIds } } },
      {
        $group: {
          _id: "$movie",
          averageRating: { $avg: "$score" },
          likedCount: {
            $sum: { $cond: [{ $gte: ["$score", 8] }, 1, 0] },
          },
          ratingCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const statsByMovieId = new Map();

  for (const movieId of movieIds) {
    statsByMovieId.set(String(movieId), {
      averageRating: 0,
      likedCount: 0,
      ratingCount: 0,
      watchlistCount: 0,
    });
  }

  for (const item of watchlistStats) {
    statsByMovieId.get(String(item._id)).watchlistCount = item.watchlistCount;
  }

  for (const item of ratingStats) {
    const stats = statsByMovieId.get(String(item._id));
    stats.averageRating = Number(item.averageRating.toFixed(1));
    stats.likedCount = item.likedCount;
    stats.ratingCount = item.ratingCount;
  }

  return statsByMovieId;
}

function attachStats(movies, statsByMovieId) {
  return movies.map((movie) => {
    const data = movie.toObject ? movie.toObject() : movie;
    data.stats = statsByMovieId.get(String(data._id));
    return data;
  });
}

function clampLimit(value, fallback = 8) {
  const limit = Number(value || fallback);

  if (!Number.isInteger(limit)) {
    return fallback;
  }

  return Math.min(Math.max(limit, 1), 20);
}

function buildDiscoveryFilter(query = {}) {
  const filter = {};
  const genre = query.genre || query.category;
  const mood = query.mood;
  const minImdbRating = Number(query.minImdbRating || query.minRating || 0);

  if (genre && genre !== "any") {
    filter.genres = genre;
  }

  if (mood && mood !== "any") {
    filter.moodTags = mood;
  }

  if (Number.isFinite(minImdbRating) && minImdbRating > 0) {
    filter.imdbRating = { $gte: minImdbRating };
  }

  return filter;
}

function buildReason(movie, query = {}) {
  const reasons = [];
  const genre = query.genre || query.category;
  const mood = query.mood;

  if (genre && genre !== "any" && movie.genres.includes(genre)) {
    reasons.push(`matches ${genre}`);
  }

  if (mood && mood !== "any" && movie.moodTags.includes(mood)) {
    reasons.push(`fits a ${mood} mood`);
  }

  if (movie.imdbRating) {
    reasons.push(`${movie.imdbRating}/10 IMDb-style rating`);
  }

  if (movie.director) {
    reasons.push(`directed by ${movie.director}`);
  }

  return reasons.length > 0 ? reasons.join(" | ") : "solid pick from your movie library";
}

function sortForDiscovery(movie, stats, query = {}) {
  const genre = query.genre || query.category;
  const mood = query.mood;
  let score = movie.imdbRating || 0;

  if (genre && genre !== "any" && movie.genres.includes(genre)) {
    score += 3;
  }

  if (mood && mood !== "any" && movie.moodTags.includes(mood)) {
    score += 3;
  }

  score += (stats.averageRating || 0) * 0.8;
  score += (stats.watchlistCount || 0) * 0.25;
  score += (stats.likedCount || 0) * 0.5;

  return score;
}

function normalizePrompt(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9.\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function readPromptFilters(prompt = "") {
  const normalized = normalizePrompt(prompt);
  const filters = {
    genres: new Set(),
    keywords: normalized ? normalized.split(" ").filter((word) => word.length > 2) : [],
    minImdbRating: 0,
    moods: new Set(),
  };

  for (const [needle, genre] of promptGenreAliases) {
    if (normalized.includes(needle)) {
      filters.genres.add(genre);
    }
  }

  for (const [needle, mood] of promptMoodAliases) {
    if (normalized.includes(needle)) {
      filters.moods.add(mood);
    }
  }

  const ratingMatch = normalized.match(/(?:above|over|min|minimum|rating|imdb)\s*(\d+(?:\.\d+)?)/);

  if (ratingMatch) {
    filters.minImdbRating = Math.min(Number(ratingMatch[1]), 10);
  }

  if (normalized.includes("best") || normalized.includes("top rated") || normalized.includes("high rated")) {
    filters.minImdbRating = Math.max(filters.minImdbRating, 8);
  }

  return {
    genres: [...filters.genres],
    keywords: filters.keywords,
    minImdbRating: filters.minImdbRating,
    moods: [...filters.moods],
  };
}

async function getUserTaste(userId) {
  if (!userId) {
    return {
      excludedMovieIds: new Set(),
      genreScores: new Map(),
      moodScores: new Map(),
    };
  }

  const [ratings, watchlist] = await Promise.all([
    Rating.find({ user: userId }).populate("movie"),
    Watchlist.find({ user: userId }).populate("movie"),
  ]);
  const excludedMovieIds = new Set();
  const genreScores = new Map();
  const moodScores = new Map();

  for (const rating of ratings) {
    if (!rating.movie) continue;

    const weight = rating.score >= 8 ? 4 : rating.score >= 6 ? 2 : -2;

    if (rating.score >= 7) {
      excludedMovieIds.add(String(rating.movie._id));
    }

    for (const genre of rating.movie.genres || []) {
      genreScores.set(genre, (genreScores.get(genre) || 0) + weight);
    }

    for (const mood of rating.movie.moodTags || []) {
      moodScores.set(mood, (moodScores.get(mood) || 0) + weight);
    }
  }

  for (const item of watchlist) {
    if (!item.movie) continue;
    excludedMovieIds.add(String(item.movie._id));

    for (const genre of item.movie.genres || []) {
      genreScores.set(genre, (genreScores.get(genre) || 0) + 1);
    }

    for (const mood of item.movie.moodTags || []) {
      moodScores.set(mood, (moodScores.get(mood) || 0) + 1);
    }
  }

  return { excludedMovieIds, genreScores, moodScores };
}

function keywordScore(movie, keywords = []) {
  if (keywords.length === 0) return 0;

  const haystack = [
    movie.title,
    movie.overview,
    movie.director,
    ...(movie.cast || []),
    ...(movie.genres || []),
    ...(movie.moodTags || []),
  ].join(" ").toLowerCase();

  return keywords.reduce((score, keyword) => score + (haystack.includes(keyword) ? 0.8 : 0), 0);
}

function buildAiReason(movie, promptFilters, taste) {
  const reasons = [];
  const matchedGenres = (movie.genres || []).filter((genre) => promptFilters.genres.includes(genre));
  const matchedMoods = (movie.moodTags || []).filter((mood) => promptFilters.moods.includes(mood));
  const favoriteGenres = (movie.genres || []).filter((genre) => (taste.genreScores.get(genre) || 0) > 0);

  if (matchedGenres.length > 0) reasons.push(`matches ${matchedGenres.join(", ")}`);
  if (matchedMoods.length > 0) reasons.push(`fits ${matchedMoods.join(", ")} mood`);
  if (favoriteGenres.length > 0) reasons.push(`connected to your ${favoriteGenres[0]} taste`);
  if (movie.imdbRating) reasons.push(`${movie.imdbRating}/10 IMDb-style rating`);
  if (movie.director) reasons.push(`directed by ${movie.director}`);

  return reasons.length > 0 ? reasons.join(" | ") : "balanced CineSense AI pick";
}

function scoreAiMovie(movie, stats, promptFilters, taste) {
  let score = movie.imdbRating || 0;

  for (const genre of movie.genres || []) {
    score += (taste.genreScores.get(genre) || 0) * 1.4;
    if (promptFilters.genres.includes(genre)) score += 8;
  }

  for (const mood of movie.moodTags || []) {
    score += (taste.moodScores.get(mood) || 0);
    if (promptFilters.moods.includes(mood)) score += 6;
  }

  score += keywordScore(movie, promptFilters.keywords);
  score += (stats.averageRating || 0) * 0.9;
  score += (stats.watchlistCount || 0) * 0.35;
  score += (stats.likedCount || 0) * 0.7;

  return score;
}

async function getMovies(req, res) {
  const filter = {};

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const movies = await Movie.find(filter).sort({ createdAt: -1 });
  const statsByMovieId = await getStatsForMovieIds(movies.map((movie) => movie._id));

  res.json({ movies: attachStats(movies, statsByMovieId) });
}

async function createMovie(req, res) {
  let movieData = {
    title: req.body.title,
    overview: req.body.overview,
    posterUrl: req.body.posterUrl,
    releaseYear: req.body.releaseYear,
    director: req.body.director,
    cast: req.body.cast,
    runtimeMinutes: req.body.runtimeMinutes,
    spokenLanguage: req.body.spokenLanguage,
    imdbRating: req.body.imdbRating,
    genres: req.body.genres,
    moodTags: req.body.moodTags,
    externalId: req.body.externalId,
    source: req.body.source,
  };

  if (!movieData.posterUrl && movieData.title) {
    try {
      const [tmdbMovie] = await tmdbService.searchMovies(movieData.title);

      if (tmdbMovie && tmdbMovie.title?.toLowerCase() === movieData.title.toLowerCase()) {
        movieData = {
          ...tmdbMovie,
          ...movieData,
          cast: movieData.cast || tmdbMovie.cast,
          director: movieData.director || tmdbMovie.director,
          genres: movieData.genres?.length > 0 ? movieData.genres : tmdbMovie.genres,
          imdbRating: movieData.imdbRating || tmdbMovie.imdbRating,
          moodTags: movieData.moodTags?.length > 0 ? movieData.moodTags : tmdbMovie.moodTags,
          overview: movieData.overview || tmdbMovie.overview,
          posterUrl: tmdbMovie.posterUrl,
          releaseYear: movieData.releaseYear || tmdbMovie.releaseYear,
          source: "tmdb",
          spokenLanguage: movieData.spokenLanguage || tmdbMovie.spokenLanguage,
        };
      }
    } catch (error) {
      const statusCode = error.statusCode || error.status;

      if (statusCode !== 503) {
        throw error;
      }
    }
  }

  const movie = await Movie.create({
    title: movieData.title,
    overview: movieData.overview,
    posterUrl: movieData.posterUrl,
    releaseYear: movieData.releaseYear,
    director: movieData.director,
    cast: movieData.cast,
    runtimeMinutes: movieData.runtimeMinutes,
    spokenLanguage: movieData.spokenLanguage,
    imdbRating: movieData.imdbRating,
    genres: movieData.genres,
    moodTags: movieData.moodTags,
    externalId: movieData.externalId,
    source: movieData.source,
  });

  res.status(201).json({ movie });
}

async function searchTmdbMovies(req, res) {
  const movies = await tmdbService.searchMovies(req.query.query || req.query.search);

  res.json({ movies });
}

async function importTmdbMovie(req, res) {
  const movieData = await tmdbService.getMovieDetails(req.params.tmdbId);
  const movie = await Movie.findOneAndUpdate(
    { externalId: movieData.externalId },
    { $set: movieData },
    {
      returnDocument: "after",
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true,
    },
  );
  const statsByMovieId = await getStatsForMovieIds([movie._id]);

  res.status(201).json({ movie: attachStats([movie], statsByMovieId)[0] });
}

async function getMovie(req, res) {
  const movie = await Movie.findById(req.params.movieId);

  if (!movie) {
    throw createHttpError(404, "movie not found");
  }

  const statsByMovieId = await getStatsForMovieIds([movie._id]);

  res.json({ movie: attachStats([movie], statsByMovieId)[0] });
}

async function getMovieStats(req, res) {
  const movie = await Movie.findById(req.params.movieId).select("_id");

  if (!movie) {
    throw createHttpError(404, "movie not found");
  }

  const statsByMovieId = await getStatsForMovieIds([movie._id]);

  res.json({ stats: statsByMovieId.get(String(movie._id)) });
}

async function getSimilarMovies(req, res) {
  const movie = await Movie.findById(req.params.movieId);

  if (!movie) {
    throw createHttpError(404, "movie not found");
  }

  if (!movie.genres || movie.genres.length === 0) {
    return res.json({ movies: [] });
  }

  const candidates = await Movie.find({
    _id: { $ne: movie._id },
    genres: { $in: movie.genres },
  });

  const rankedMovies = candidates
    .map((candidate) => ({
      movie: candidate,
      score: candidate.genres.filter((genre) => movie.genres.includes(genre)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.movie);

  const statsByMovieId = await getStatsForMovieIds(rankedMovies.map((item) => item._id));

  res.json({ movies: attachStats(rankedMovies, statsByMovieId) });
}

async function getRecommendations(req, res) {
  const userId = req.query.userId;

  if (!userId) {
    throw createHttpError(400, "userId is required");
  }

  const [ratings, watchlist] = await Promise.all([
    Rating.find({ user: userId }).populate("movie"),
    Watchlist.find({ user: userId }).populate("movie"),
  ]);

  const excludedMovieIds = new Set();
  const genreScores = new Map();

  for (const rating of ratings) {
    if (!rating.movie) continue;
    excludedMovieIds.add(String(rating.movie._id));

    const weight = rating.score >= 8 ? 3 : rating.score >= 6 ? 2 : 1;

    for (const genre of rating.movie.genres || []) {
      genreScores.set(genre, (genreScores.get(genre) || 0) + weight);
    }
  }

  for (const item of watchlist) {
    if (!item.movie) continue;
    excludedMovieIds.add(String(item.movie._id));

    for (const genre of item.movie.genres || []) {
      genreScores.set(genre, (genreScores.get(genre) || 0) + 1);
    }
  }

  const favoriteGenres = [...genreScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);

  const filter = {};

  if (excludedMovieIds.size > 0) {
    filter._id = { $nin: [...excludedMovieIds] };
  }

  if (favoriteGenres.length > 0) {
    filter.genres = { $in: favoriteGenres };
  }

  const candidates = await Movie.find(filter).limit(50);
  const statsByMovieId = await getStatsForMovieIds(candidates.map((movie) => movie._id));

  const recommendations = candidates
    .map((movie) => {
      const genreScore = (movie.genres || []).reduce(
        (total, genre) => total + (genreScores.get(genre) || 0),
        0,
      );
      const stats = statsByMovieId.get(String(movie._id));

      return {
        movie,
        score: genreScore + stats.averageRating + stats.watchlistCount * 0.25,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.movie);

  res.json({
    favoriteGenres: favoriteGenres.slice(0, 5),
    movies: attachStats(recommendations, statsByMovieId),
  });
}

async function getDiscoveryRecommendations(req, res) {
  const limit = clampLimit(req.query.limit, 8);
  const filter = buildDiscoveryFilter(req.query);
  const candidates = await Movie.find(filter).limit(100);
  const statsByMovieId = await getStatsForMovieIds(candidates.map((movie) => movie._id));

  const movies = candidates
    .map((movie) => ({
      movie,
      score: sortForDiscovery(movie, statsByMovieId.get(String(movie._id)), req.query),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.movie);

  const responseMovies = attachStats(movies, statsByMovieId).map((movie) => ({
    ...movie,
    recommendationReason: buildReason(movie, req.query),
  }));

  res.json({
    filters: {
      genre: req.query.genre || req.query.category || "any",
      limit,
      minImdbRating: Number(req.query.minImdbRating || req.query.minRating || 0),
      mood: req.query.mood || "any",
    },
    movies: responseMovies,
  });
}

async function getAiRecommendations(req, res) {
  const limit = clampLimit(req.query.limit, 8);
  const prompt = req.query.prompt || "";
  const promptFilters = readPromptFilters(prompt);
  const taste = await getUserTaste(req.query.userId);
  const filter = {};

  if (taste.excludedMovieIds.size > 0) {
    filter._id = { $nin: [...taste.excludedMovieIds] };
  }

  if (promptFilters.minImdbRating > 0) {
    filter.imdbRating = { $gte: promptFilters.minImdbRating };
  }

  const candidates = await Movie.find(filter).limit(160);
  const statsByMovieId = await getStatsForMovieIds(candidates.map((movie) => movie._id));
  const ranked = candidates
    .map((movie) => ({
      movie,
      score: scoreAiMovie(movie, statsByMovieId.get(String(movie._id)), promptFilters, taste),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.movie);
  const movies = attachStats(ranked, statsByMovieId).map((movie) => ({
    ...movie,
    recommendationReason: buildAiReason(movie, promptFilters, taste),
  }));

  res.json({
    interpreted: {
      genres: promptFilters.genres,
      minImdbRating: promptFilters.minImdbRating,
      moods: promptFilters.moods,
      prompt,
    },
    movies,
  });
}

async function getRandomMovie(req, res) {
  const filter = buildDiscoveryFilter(req.query);
  const movies = await Movie.aggregate([
    { $match: filter },
    { $sample: { size: 1 } },
  ]);

  if (movies.length === 0) {
    return res.json({ movie: null });
  }

  const statsByMovieId = await getStatsForMovieIds([movies[0]._id]);
  const movie = attachStats(movies, statsByMovieId)[0];

  res.json({
    movie: {
      ...movie,
      recommendationReason: `random pick: ${buildReason(movie, req.query)}`,
    },
  });
}

module.exports = {
  createMovie,
  getAiRecommendations,
  getDiscoveryRecommendations,
  getMovie,
  getMovieStats,
  getMovies,
  getRandomMovie,
  getRecommendations,
  getSimilarMovies,
  importTmdbMovie,
  searchTmdbMovies,
};
