"use strict";

const createHttpError = require("../utils/httpError");

const baseUrl = "https://api.themoviedb.org/3";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

const genreMap = new Map([
  [12, "Adventure"],
  [14, "Fantasy"],
  [16, "Animation"],
  [18, "Drama"],
  [27, "Horror"],
  [28, "Action"],
  [35, "Comedy"],
  [36, "History"],
  [37, "Western"],
  [53, "Thriller"],
  [80, "Crime"],
  [99, "Documentary"],
  [878, "Sci-Fi"],
  [9648, "Mystery"],
  [10402, "Music"],
  [10749, "Romance"],
  [10751, "Family"],
  [10752, "War"],
  [10770, "TV Movie"],
]);

function ensureCredentials() {
  if (!process.env.TMDB_ACCESS_TOKEN && !process.env.TMDB_API_KEY) {
    throw createHttpError(
      503,
      "TMDB is not configured. Add TMDB_API_KEY or TMDB_ACCESS_TOKEN to .env.",
    );
  }
}

function posterUrl(path) {
  return path ? `${imageBaseUrl}${path}` : "";
}

function releaseYear(releaseDate) {
  return releaseDate ? Number(releaseDate.slice(0, 4)) : undefined;
}

function moodTagsFromGenres(genres) {
  const tags = new Set();

  for (const genre of genres) {
    if (["Action", "Adventure", "War"].includes(genre)) tags.add("intense");
    if (["Comedy", "Family", "Animation"].includes(genre)) tags.add("fun");
    if (["Drama", "Romance", "Music"].includes(genre)) tags.add("emotional");
    if (["Mystery", "Sci-Fi", "Thriller"].includes(genre)) tags.add("mind-bending");
    if (["Documentary", "History"].includes(genre)) tags.add("thoughtful");
  }

  return [...tags];
}

async function tmdbRequest(path, params = {}) {
  ensureCredentials();

  const url = new URL(`${baseUrl}${path}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  const headers = {};

  if (process.env.TMDB_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  } else {
    url.searchParams.set("api_key", process.env.TMDB_API_KEY);
  }

  let response;

  try {
    response = await fetch(url, { headers });
  } catch (error) {
    throw createHttpError(
      503,
      "TMDB search is temporarily unavailable. Check your internet connection.",
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw createHttpError(response.status, data.status_message || "TMDB request failed");
  }

  return data;
}

function normalizeSearchMovie(movie) {
  const genres = (movie.genre_ids || [])
    .map((genreId) => genreMap.get(genreId))
    .filter(Boolean);

  return {
    cast: [],
    director: "",
    externalId: `tmdb:${movie.id}`,
    genres,
    imdbRating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : undefined,
    moodTags: moodTagsFromGenres(genres),
    overview: movie.overview || "",
    posterUrl: posterUrl(movie.poster_path),
    releaseYear: releaseYear(movie.release_date),
    runtimeMinutes: undefined,
    source: "tmdb",
    spokenLanguage: movie.original_language ? movie.original_language.toUpperCase() : "",
    title: movie.title || movie.original_title,
    tmdbId: movie.id,
  };
}

function normalizeDetailedMovie(movie) {
  const genres = (movie.genres || []).map((genre) => genre.name);
  const director = (movie.credits?.crew || []).find((member) => member.job === "Director");
  const cast = (movie.credits?.cast || []).slice(0, 5).map((member) => member.name);
  const spokenLanguage = movie.spoken_languages?.[0]?.english_name || "";

  return {
    cast,
    director: director ? director.name : "",
    externalId: `tmdb:${movie.id}`,
    genres,
    imdbRating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : undefined,
    moodTags: moodTagsFromGenres(genres),
    overview: movie.overview || "",
    posterUrl: posterUrl(movie.poster_path),
    releaseYear: releaseYear(movie.release_date),
    runtimeMinutes: movie.runtime,
    source: "tmdb",
    spokenLanguage,
    title: movie.title || movie.original_title,
  };
}

async function searchMovies(query) {
  if (!query || !query.trim()) {
    throw createHttpError(400, "query is required");
  }

  const data = await tmdbRequest("/search/movie", {
    include_adult: "false",
    language: "en-US",
    page: "1",
    query,
  });

  return (data.results || []).slice(0, 12).map(normalizeSearchMovie);
}

async function getMovieDetails(tmdbId) {
  if (!tmdbId) {
    throw createHttpError(400, "tmdbId is required");
  }

  const data = await tmdbRequest(`/movie/${tmdbId}`, {
    append_to_response: "credits",
    language: "en-US",
  });

  return normalizeDetailedMovie(data);
}

module.exports = {
  getMovieDetails,
  searchMovies,
};
