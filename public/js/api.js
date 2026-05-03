"use strict";

const API_BASE_URL = "/api";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || (data.errors && data.errors.join(", ")) || "Request failed");
  }

  return data;
}

function getMovies(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest(`/movies${query}`);
}

function getMovie(movieId) {
  return apiRequest(`/movies/${movieId}`);
}

function getUser(userId) {
  return apiRequest(`/users/${encodeURIComponent(userId)}`);
}

function getDiscoveryRecommendations(filters = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }

  return apiRequest(`/movies/discover?${params.toString()}`);
}

function getAiRecommendations(filters = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }

  return apiRequest(`/movies/ai?${params.toString()}`);
}

function getRecommendations(userId) {
  return apiRequest(`/movies/recommendations?userId=${encodeURIComponent(userId)}`);
}

function getRandomMovie(filters = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }

  return apiRequest(`/movies/random?${params.toString()}`);
}

function getWorldRecommendations(filters = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }

  return apiRequest(`/movies/world?${params.toString()}`);
}

function getWorldRandomMovie(filters = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  }

  return apiRequest(`/movies/world/random?${params.toString()}`);
}

function searchTmdbMovies(query) {
  return apiRequest(`/movies/tmdb/search?query=${encodeURIComponent(query)}`);
}

function importTmdbMovie(tmdbId) {
  return apiRequest(`/movies/tmdb/${tmdbId}/import`, {
    method: "POST",
  });
}

function getSimilarMovies(movieId) {
  return apiRequest(`/movies/${movieId}/similar`);
}

function createMovie(movie) {
  return apiRequest("/movies", {
    method: "POST",
    body: JSON.stringify(movie),
  });
}

function getDemoUser() {
  return apiRequest("/users/demo");
}

function loginUser(email, password) {
  return apiRequest("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

function registerUser(name, email, password) {
  return apiRequest("/users/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

function getWatchlist(userId) {
  return apiRequest(`/watchlist?userId=${encodeURIComponent(userId)}`);
}

function addToWatchlist(userId, movieId, status = "planned") {
  return apiRequest("/watchlist", {
    method: "POST",
    body: JSON.stringify({ userId, movieId, status }),
  });
}

function removeFromWatchlist(userId, movieId) {
  return apiRequest(`/watchlist/users/${userId}/movies/${movieId}`, {
    method: "DELETE",
  });
}

function getRatings(userId) {
  return apiRequest(`/ratings?userId=${encodeURIComponent(userId)}`);
}

function rateMovie(userId, movieId, score, review = "") {
  return apiRequest("/ratings", {
    method: "POST",
    body: JSON.stringify({ userId, movieId, score, review }),
  });
}

window.cineWatchApi = {
  addToWatchlist,
  createMovie,
  getAiRecommendations,
  getDemoUser,
  getDiscoveryRecommendations,
  getMovie,
  getMovies,
  getRecommendations,
  getRandomMovie,
  getRatings,
  getSimilarMovies,
  getUser,
  getWatchlist,
  getWorldRandomMovie,
  getWorldRecommendations,
  importTmdbMovie,
  loginUser,
  rateMovie,
  registerUser,
  removeFromWatchlist,
  searchTmdbMovies,
};
