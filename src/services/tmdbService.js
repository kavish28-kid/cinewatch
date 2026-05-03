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

const genreIdByName = new Map(
  [...genreMap.entries()].map(([id, name]) => [name.toLowerCase(), id]),
);

const moodGenreIds = new Map([
  ["emotional", [18, 10749, 10402]],
  ["fun", [35, 12, 16, 10751]],
  ["inspiring", [18, 36, 99]],
  ["intense", [28, 53, 80, 10752]],
  ["mind-bending", [878, 9648, 53]],
  ["romantic", [10749, 18]],
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

function genreIdsForFilters(filters = {}) {
  const ids = new Set();
  const genres = [
    filters.genre,
    ...(Array.isArray(filters.genres) ? filters.genres : []),
  ].filter(Boolean);
  const moods = [
    filters.mood,
    ...(Array.isArray(filters.moods) ? filters.moods : []),
  ].filter(Boolean);

  for (const genre of genres) {
    if (genre === "any") continue;
    const genreId = genreIdByName.get(String(genre).toLowerCase());

    if (genreId) ids.add(genreId);
  }

  if (ids.size === 0) {
    for (const mood of moods) {
      if (mood === "any") continue;

      for (const genreId of moodGenreIds.get(String(mood).toLowerCase()) || []) {
        ids.add(genreId);
      }
    }
  }

  return [...ids];
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
    const statusMessage = data.status_message || "TMDB request failed";

    if (response.status === 401 && statusMessage.toLowerCase().includes("api key")) {
      throw createHttpError(
        response.status,
        "Invalid TMDB API key. Update TMDB_API_KEY in Render Environment, then redeploy.",
      );
    }

    throw createHttpError(response.status, statusMessage);
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

async function discoverTopRatedMovies(filters = {}) {
  const limit = Math.min(Math.max(Number(filters.limit || 8), 1), 20);
  const genreIds = genreIdsForFilters(filters);
  const minRating = Number(filters.minImdbRating || filters.minRating || 7);
  const page = Math.min(Math.max(Number(filters.page || 1), 1), 20);
  const sortBy = filters.sort === "popular" ? "popularity.desc" : "vote_average.desc";
  const data = await tmdbRequest("/discover/movie", {
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    page: String(page),
    sort_by: sortBy,
    "vote_average.gte": Number.isFinite(minRating) ? String(Math.min(minRating, 10)) : "7",
    "vote_count.gte": filters.sort === "popular" ? "250" : "1000",
    with_original_language: filters.language || undefined,
    with_genres: genreIds.length > 0 ? genreIds.join("|") : undefined,
  });
  const movies = (data.results || []).map(normalizeSearchMovie);
  const moviesWithPosters = movies.filter((movie) => movie.posterUrl);

  return (moviesWithPosters.length > 0 ? moviesWithPosters : movies).slice(0, limit);
}

async function getRandomTopRatedMovie(filters = {}) {
  const movies = await discoverTopRatedMovies({
    ...filters,
    limit: 20,
    page: Math.floor(Math.random() * 5) + 1,
  });

  if (movies.length === 0) {
    return null;
  }

  return movies[Math.floor(Math.random() * movies.length)];
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
  discoverTopRatedMovies,
  getMovieDetails,
  getRandomTopRatedMovie,
  searchMovies,
};
