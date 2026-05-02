"use strict";

const activeUser = document.querySelector("#active-user");
const clearHistoryButton = document.querySelector("#clear-history");
const heroCinesenseButton = document.querySelector("#hero-cinesense");
const heroDashboardButton = document.querySelector("#hero-dashboard");
const heroDetailsButton = document.querySelector("#hero-details");
const heroKicker = document.querySelector("#hero-kicker");
const heroMeta = document.querySelector("#hero-meta");
const heroOverview = document.querySelector("#hero-overview") || document.querySelector(".hero-copy p");
const heroPosters = document.querySelector("#hero-posters");
const heroTitle = document.querySelector("#hero-title");
const historyList = document.querySelector("#search-history");
const appMenu = document.querySelector("#app-menu");
const menuBackdrop = document.querySelector("#menu-backdrop");
const menuToggle = document.querySelector("#menu-toggle");
const modalClose = document.querySelector("#modal-close");
const modalContent = document.querySelector("#modal-content");
const movieForm = document.querySelector("#movie-form");
const movieModal = document.querySelector("#movie-modal");
const moviesList = document.querySelector("#movies");
const metricAverageRating = document.querySelector("#metric-average-rating");
const metricRated = document.querySelector("#metric-rated");
const metricTotalMovies = document.querySelector("#metric-total-movies");
const metricWatchlist = document.querySelector("#metric-watchlist");
const favoriteGenreInsight = document.querySelector("#favorite-genre-insight");
const highestRatedInsight = document.querySelector("#highest-rated-insight");
const nextPickInsight = document.querySelector("#next-pick-insight");
const recommendationsList = document.querySelector("#recommendations");
const randomButton = document.querySelector("#random-button");
const senseForm = document.querySelector("#sense-form");
const senseResultsList = document.querySelector("#sense-results");
const similarMoviesList = document.querySelector("#similar-movies");
const menuLinks = document.querySelectorAll(".menu-link");
const tmdbForm = document.querySelector("#tmdb-form");
const tmdbQuery = document.querySelector("#tmdb-query");
const tmdbResultsList = document.querySelector("#tmdb-results");
const watchlistList = document.querySelector("#watchlist");
const favoriteGenres = document.querySelector("#favorite-genres");
const message = document.querySelector("#message");
const searchInput = document.querySelector("#search");
const views = document.querySelectorAll(".app-view");

const state = {
  movies: [],
  recommendations: [],
  ratingsByMovieId: new Map(),
  similarMovies: [],
  senseResults: [],
  tmdbResults: [],
  user: null,
  featuredMovieId: null,
  watchlistByMovieId: new Map(),
};

const historyKey = "cinewatch-search-history";
const fallbackPosterUrls = {
  "3 Idiots": "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
  "Avengers: Endgame": "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
  Dangal: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg",
  "Guardians of the Galaxy": "https://upload.wikimedia.org/wikipedia/en/3/33/Guardians_of_the_Galaxy_%28film%29_poster.jpg",
  Inception: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
  Interstellar: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
  "La La Land": "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png",
  "The Dark Knight": "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
};

function getId(record) {
  return record.id || record._id;
}

function showMessage(text) {
  message.textContent = text;
}

function showApiError(error) {
  showMessage(
    error.message === "database connection unavailable"
      ? "Database is offline. Check MongoDB Atlas Network Access or switch to mobile hotspot."
      : error.message,
  );
}

function movieSubtitle(movie) {
  const parts = [];

  if (movie.releaseYear) parts.push(movie.releaseYear);
  if (movie.imdbRating) parts.push(`${movie.imdbRating}/10 IMDb`);
  if (movie.runtimeMinutes) parts.push(`${movie.runtimeMinutes} min`);
  if (movie.genres && movie.genres.length > 0) parts.push(movie.genres.join(", "));

  return parts.join(" | ");
}

function statsText(movie) {
  const stats = movie.stats || {};
  const pieces = [];

  pieces.push(`${stats.watchlistCount || 0} watchlisted`);

  if (stats.ratingCount > 0) {
    pieces.push(`${stats.averageRating}/10 avg`);
    pieces.push(`${stats.likedCount || 0} liked`);
  } else {
    pieces.push("No ratings yet");
  }

  return pieces.join(" | ");
}

function movieDetailText(movie) {
  const pieces = [];

  if (movie.director) pieces.push(`Director: ${movie.director}`);
  if (movie.cast && movie.cast.length > 0) pieces.push(`Cast: ${movie.cast.slice(0, 3).join(", ")}`);
  if (movie.spokenLanguage) pieces.push(`Language: ${movie.spokenLanguage}`);

  return pieces.join(" | ");
}

function initials(title = "") {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "CW";
}

function fillPosterFallback(poster, movie) {
  const mark = document.createElement("strong");
  const genre = document.createElement("span");
  mark.textContent = initials(movie.title);
  genre.textContent = movie.genres?.[0] || "CineWatch";
  poster.replaceChildren(mark, genre);
}

function createPoster(movie, extraClass = "") {
  const poster = document.createElement("div");
  poster.className = `poster ${extraClass}`.trim();
  const posterUrl = movie.posterUrl || fallbackPosterUrls[movie.title];

  if (posterUrl) {
    const image = document.createElement("img");
    image.src = posterUrl;
    image.alt = `${movie.title} poster`;
    image.addEventListener("error", () => fillPosterFallback(poster, movie), { once: true });
    poster.appendChild(image);
  } else {
    fillPosterFallback(poster, movie);
  }

  return poster;
}

function posterUrlFor(movie) {
  return movie.posterUrl || fallbackPosterUrls[movie.title] || "";
}

function pickFeaturedMovie() {
  return state.recommendations[0]
    || [...state.movies].sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0))[0]
    || null;
}

function renderHero() {
  const movie = pickFeaturedMovie();

  if (!movie) {
    state.featuredMovieId = null;
    renderLandingHero();
    return;
  }

  const posterUrl = posterUrlFor(movie);
  state.featuredMovieId = getId(movie);
  heroKicker.textContent = state.recommendations[0] ? "CineSense Premiere" : "Now Showing";
  heroTitle.textContent = movie.title;
  heroOverview.textContent = movie.overview || "A strong pick from your CineWatch library.";
  heroMeta.textContent = [
    movie.releaseYear,
    movie.imdbRating ? `${movie.imdbRating}/10 IMDb` : "",
    movie.director ? `By ${movie.director}` : "",
    movie.genres?.slice(0, 2).join(" / "),
  ].filter(Boolean).join(" / ");

  if (posterUrl) {
    document.documentElement.style.setProperty("--hero-image", `url("${posterUrl}")`);
  }
}

function renderLandingHero() {
  heroKicker.textContent = "CineWatch Premiere";
  heroTitle.textContent = "Find your next big-screen obsession.";
  heroOverview.textContent = "Search real posters, build your watchlist, and let CineSense choose the movie when nobody can decide.";
  heroMeta.textContent = "Poster search / Watchlist / Ratings / AI picks";
  state.featuredMovieId = null;
}

function renderHeroPosters() {
  heroPosters.innerHTML = "";

  const featuredMovies = [...state.movies]
    .sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0))
    .slice(0, 4);

  if (featuredMovies.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Add movies to build your front page.";
    heroPosters.appendChild(empty);
    return;
  }

  for (const movie of featuredMovies) {
    const button = document.createElement("button");
    button.className = "hero-poster-card";
    button.type = "button";
    button.addEventListener("click", () => openMovieDetails(getId(movie)));

    const label = document.createElement("span");
    label.textContent = `${movie.title} ${movie.imdbRating ? `| ${movie.imdbRating}/10` : ""}`;

    button.append(createPoster(movie), label);
    heroPosters.appendChild(button);
  }
}

function renderMovieCards(listElement, movies, emptyText, { compactActions = false } = {}) {
  listElement.innerHTML = "";

  if (movies.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = emptyText;
    listElement.appendChild(item);
    return;
  }

  for (const movie of movies) {
    const movieId = getId(movie);
    const watchlistItem = state.watchlistByMovieId.get(movieId);
    const rating = state.ratingsByMovieId.get(movieId);
    const item = document.createElement("li");
    item.className = "movie-card";
    const poster = createPoster(movie, "card-poster");

    const details = document.createElement("div");
    details.className = "movie-details";

    const title = document.createElement("h3");
    title.textContent = movie.title;
    title.tabIndex = 0;
    title.className = "clickable-title";
    title.addEventListener("click", () => openMovieDetails(movieId));
    title.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMovieDetails(movieId);
      }
    });

    const subtitle = document.createElement("p");
    subtitle.textContent = movieSubtitle(movie) || "Movie";

    const credit = document.createElement("p");
    credit.className = "movie-stats";
    credit.textContent = movieDetailText(movie);

    const overview = document.createElement("p");
    overview.className = "movie-overview";
    overview.textContent = movie.overview || "";

    const stats = document.createElement("p");
    stats.className = "movie-stats";
    stats.textContent = statsText(movie);

    const ratingText = document.createElement("span");
    ratingText.className = "badge";
    ratingText.textContent = rating ? `Rated ${rating.score}/10` : "Not rated";
    const reviewText = document.createElement("p");
    reviewText.className = "review-snippet";
    reviewText.textContent = rating?.review ? `"${rating.review}"` : "";

    details.append(title, subtitle);

    if (credit.textContent) details.appendChild(credit);
    if (overview.textContent) details.appendChild(overview);

    details.append(stats, ratingText);

    if (reviewText.textContent) {
      details.appendChild(reviewText);
    }

    if (movie.recommendationReason) {
      const reason = document.createElement("p");
      reason.className = "reason-text";
      reason.textContent = movie.recommendationReason;
      details.appendChild(reason);
    }

    const controls = document.createElement("div");
    controls.className = "movie-actions";

    const watchlistButton = document.createElement("button");
    watchlistButton.type = "button";
    watchlistButton.className = watchlistItem ? "secondary danger" : "secondary";
    watchlistButton.textContent = watchlistItem ? "Remove" : "Watchlist";
    watchlistButton.addEventListener("click", () => toggleWatchlist(movieId, Boolean(watchlistItem)));

    const similarButton = document.createElement("button");
    similarButton.type = "button";
    similarButton.className = "secondary";
    similarButton.textContent = "Similar";
    similarButton.addEventListener("click", () => showSimilarMovies(movieId, movie.title));

    controls.append(watchlistButton, similarButton);

    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "secondary";
    detailsButton.textContent = "Details";
    detailsButton.addEventListener("click", () => openMovieDetails(movieId));

    controls.appendChild(detailsButton);

    if (!compactActions) {
      const ratingSelect = document.createElement("select");
      ratingSelect.setAttribute("aria-label", `Rating for ${movie.title}`);

      for (let score = 1; score <= 10; score += 1) {
        const option = document.createElement("option");
        option.value = String(score);
        option.textContent = `${score}/10`;
        ratingSelect.appendChild(option);
      }

      ratingSelect.value = rating ? String(rating.score) : "8";

      const rateButton = document.createElement("button");
      rateButton.type = "button";
      rateButton.textContent = "Rate";
      rateButton.addEventListener("click", () => saveRating(movieId, Number(ratingSelect.value), rating?.review || ""));

      controls.append(ratingSelect, rateButton);
    }

    item.append(poster, details, controls);
    listElement.appendChild(item);
  }
}

function renderModalMovie(movie, similarMovies = []) {
  const movieId = getId(movie);
  const watchlistItem = state.watchlistByMovieId.get(movieId);
  const rating = state.ratingsByMovieId.get(movieId);
  modalContent.innerHTML = "";

  const layout = document.createElement("div");
  layout.className = "modal-layout";

  const details = document.createElement("section");
  details.className = "modal-details";

  const title = document.createElement("h2");
  title.textContent = movie.title;

  const subtitle = document.createElement("p");
  subtitle.className = "modal-subtitle";
  subtitle.textContent = movieSubtitle(movie);

  const overview = document.createElement("p");
  overview.className = "modal-overview";
  overview.textContent = movie.overview || "No overview available yet.";

  const facts = document.createElement("div");
  facts.className = "fact-grid";

  const factItems = [
    ["Director", movie.director || "Unknown"],
    ["Cast", movie.cast && movie.cast.length > 0 ? movie.cast.join(", ") : "Unknown"],
    ["Language", movie.spokenLanguage || "Unknown"],
    ["Runtime", movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : "Unknown"],
    ["IMDb-style rating", movie.imdbRating ? `${movie.imdbRating}/10` : "Not available"],
    ["CineWatch stats", statsText(movie)],
  ];

  for (const [label, value] of factItems) {
    const fact = document.createElement("div");
    const labelElement = document.createElement("span");
    const valueElement = document.createElement("strong");
    labelElement.textContent = label;
    valueElement.textContent = value;
    fact.append(labelElement, valueElement);
    facts.appendChild(fact);
  }

  const actions = document.createElement("div");
  actions.className = "modal-actions";

  const watchlistButton = document.createElement("button");
  watchlistButton.type = "button";
  watchlistButton.className = watchlistItem ? "secondary danger" : "secondary";
  watchlistButton.textContent = watchlistItem ? "Remove from Watchlist" : "Add to Watchlist";
  watchlistButton.addEventListener("click", async () => {
    await toggleWatchlist(movieId, Boolean(watchlistItem));
    movieModal.close();
  });

  const ratingSelect = document.createElement("select");
  ratingSelect.setAttribute("aria-label", `Rating for ${movie.title}`);

  for (let score = 1; score <= 10; score += 1) {
    const option = document.createElement("option");
    option.value = String(score);
    option.textContent = `${score}/10`;
    ratingSelect.appendChild(option);
  }

  ratingSelect.value = rating ? String(rating.score) : "8";

  const reviewInput = document.createElement("textarea");
  reviewInput.className = "review-input";
  reviewInput.placeholder = "Add a short review...";
  reviewInput.rows = 3;
  reviewInput.value = rating?.review || "";

  const rateButton = document.createElement("button");
  rateButton.type = "button";
  rateButton.textContent = "Save Rating";
  rateButton.addEventListener("click", async () => {
    await saveRating(movieId, Number(ratingSelect.value), reviewInput.value.trim());
    movieModal.close();
  });

  actions.append(watchlistButton, ratingSelect, rateButton);

  const similarSection = document.createElement("section");
  similarSection.className = "modal-similar";

  const similarTitle = document.createElement("h3");
  similarTitle.textContent = "Similar Movies";
  const similarList = document.createElement("ul");
  similarList.className = "side-list";

  if (similarMovies.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = "No similar movies found yet.";
    similarList.appendChild(item);
  } else {
    for (const similarMovie of similarMovies.slice(0, 5)) {
      const item = document.createElement("li");
      const name = document.createElement("strong");
      const meta = document.createElement("span");
      name.textContent = similarMovie.title;
      meta.textContent = movieSubtitle(similarMovie) || statsText(similarMovie);
      item.append(name, meta);
      similarList.appendChild(item);
    }
  }

  similarSection.append(similarTitle, similarList);
  details.append(title, subtitle, overview, facts, reviewInput, actions, similarSection);
  layout.append(createPoster(movie, "detail-poster"), details);
  modalContent.appendChild(layout);
}

function renderDashboard() {
  const ratings = [...state.ratingsByMovieId.values()];
  const watchlistItems = [...state.watchlistByMovieId.values()];
  const averageRating = ratings.length > 0
    ? (ratings.reduce((total, rating) => total + rating.score, 0) / ratings.length).toFixed(1)
    : "0";
  const genreCounts = new Map();

  for (const item of watchlistItems) {
    for (const genre of item.movie?.genres || []) {
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
    }
  }

  for (const rating of ratings) {
    for (const genre of rating.movie?.genres || []) {
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + rating.score / 5);
    }
  }

  const favoriteGenre = [...genreCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const highestRating = [...ratings].sort((a, b) => b.score - a.score)[0];
  const nextPick = state.recommendations[0];

  metricTotalMovies.textContent = String(state.movies.length);
  metricWatchlist.textContent = String(watchlistItems.length);
  metricRated.textContent = String(ratings.length);
  metricAverageRating.textContent = averageRating;
  favoriteGenreInsight.textContent = favoriteGenre
    ? `${favoriteGenre[0]} is currently your strongest taste signal.`
    : "Rate and watchlist movies to discover your taste.";
  highestRatedInsight.textContent = highestRating
    ? `${highestRating.movie.title} at ${highestRating.score}/10${highestRating.review ? `: "${highestRating.review}"` : ""}`
    : "No rated movies yet.";
  nextPickInsight.textContent = nextPick
    ? `${nextPick.title} looks like your next best pick.`
    : "CineSense will choose from your recommendation list.";
}

function renderMovies() {
  renderMovieCards(moviesList, state.movies, "No movies yet. Add one above.");
}

function renderTmdbResults() {
  tmdbResultsList.innerHTML = "";

  for (const movie of state.tmdbResults) {
    const item = document.createElement("li");
    item.className = "tmdb-card";

    const poster = document.createElement("div");
    poster.className = "poster";

    if (movie.posterUrl) {
      const image = document.createElement("img");
      image.src = movie.posterUrl;
      image.alt = `${movie.title} poster`;
      poster.appendChild(image);
    } else {
      poster.textContent = "No poster";
    }

    const details = document.createElement("div");
    details.className = "movie-details";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const subtitle = document.createElement("p");
    subtitle.textContent = movieSubtitle(movie) || "TMDB movie";

    const overview = document.createElement("p");
    overview.className = "movie-overview";
    overview.textContent = movie.overview || "No overview available.";

    const importButton = document.createElement("button");
    importButton.type = "button";
    importButton.textContent = "Import";
    importButton.addEventListener("click", () => importTmdbMovie(movie.tmdbId));

    details.append(title, subtitle, overview, importButton);
    item.append(poster, details);
    tmdbResultsList.appendChild(item);
  }
}

function renderCompactMovieList(listElement, movies, emptyText) {
  listElement.innerHTML = "";

  if (movies.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = emptyText;
    listElement.appendChild(item);
    return;
  }

  for (const movie of movies) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = movie.title;

    const meta = document.createElement("span");
    meta.textContent = statsText(movie);

    item.append(title, meta);
    listElement.appendChild(item);
  }
}

function renderWatchlist() {
  watchlistList.innerHTML = "";

  const items = [...state.watchlistByMovieId.values()];

  if (items.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = "Your watchlist is empty.";
    watchlistList.appendChild(item);
    return;
  }

  for (const watchlistItem of items) {
    const item = document.createElement("li");
    const movie = watchlistItem.movie;
    const title = document.createElement("strong");
    title.textContent = movie.releaseYear ? `${movie.title} (${movie.releaseYear})` : movie.title;

    const meta = document.createElement("span");
    meta.textContent = watchlistItem.status;

    item.append(title, meta);
    watchlistList.appendChild(item);
  }
}

function renderRecommendations() {
  renderCompactMovieList(
    recommendationsList,
    state.recommendations,
    "Rate or watchlist movies to generate recommendations.",
  );
}

function renderSimilarMovies() {
  renderCompactMovieList(
    similarMoviesList,
    state.similarMovies,
    "Choose a movie and click Similar.",
  );
}

function readSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem(historyKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveSearch(query) {
  if (!query) return;

  const history = readSearchHistory().filter((item) => item.query !== query);
  history.unshift({
    query,
    searchedAt: new Date().toLocaleString(),
  });

  localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 12)));
  renderSearchHistory();
}

function renderSearchHistory() {
  const history = readSearchHistory();
  historyList.innerHTML = "";

  if (history.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = "No searches yet.";
    historyList.appendChild(item);
    return;
  }

  for (const entry of history) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "secondary";
    button.type = "button";
    button.textContent = entry.query;
    button.addEventListener("click", () => {
      searchInput.value = entry.query;
      switchView("browse");
      renderApp(entry.query);
    });

    const meta = document.createElement("span");
    meta.textContent = entry.searchedAt;

    item.append(button, meta);
    historyList.appendChild(item);
  }
}

function setMenuOpen(isOpen) {
  appMenu.classList.toggle("open", isOpen);
  menuBackdrop.classList.toggle("open", isOpen);
  menuToggle.classList.toggle("open", isOpen);
  appMenu.setAttribute("aria-hidden", String(!isOpen));
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function switchView(viewName) {
  for (const view of views) {
    view.classList.toggle("active", view.id === `${viewName}-view`);
  }

  for (const button of menuLinks) {
    button.classList.toggle("active", button.dataset.view === viewName);
  }

  setMenuOpen(false);
}

async function refreshUserData() {
  const userId = getId(state.user);
  const [watchlistData, ratingsData] = await Promise.all([
    window.cineWatchApi.getWatchlist(userId),
    window.cineWatchApi.getRatings(userId),
  ]);

  state.watchlistByMovieId = new Map(
    watchlistData.watchlist.map((item) => [getId(item.movie), item]),
  );
  state.ratingsByMovieId = new Map(
    ratingsData.ratings.map((rating) => [getId(rating.movie), rating]),
  );
}

async function loadMovies(search = "") {
  const data = await window.cineWatchApi.getMovies(search);
  state.movies = data.movies;
}

async function loadRecommendations() {
  const data = await window.cineWatchApi.getRecommendations(getId(state.user));
  state.recommendations = data.movies;
  favoriteGenres.textContent = data.favoriteGenres.length > 0
    ? `Based on: ${data.favoriteGenres.join(", ")}`
    : "Based on trending activity.";
}

async function renderApp(search = "") {
  try {
    renderLandingHero();

    if (!state.user) {
      const data = await window.cineWatchApi.getDemoUser();
      state.user = data.user;
      activeUser.textContent = `Using ${state.user.name}`;
    }

    await Promise.all([loadMovies(search), refreshUserData(), loadRecommendations()]);
    renderHero();
    renderHeroPosters();
    renderMovies();
    renderWatchlist();
    renderRecommendations();
    renderSimilarMovies();
    renderSearchHistory();
    renderDashboard();
    showMessage("Ready.");
  } catch (error) {
    showApiError(error);
  }
}

function readSenseFilters() {
  const formData = new FormData(senseForm);

  return {
    genre: formData.get("genre"),
    limit: formData.get("limit"),
    minImdbRating: formData.get("minImdbRating"),
    mood: formData.get("mood"),
    prompt: formData.get("prompt"),
  };
}

async function runCineSense() {
  try {
    const filters = readSenseFilters();
    const data = filters.prompt?.trim()
      ? await window.cineWatchApi.getAiRecommendations({
        ...filters,
        userId: getId(state.user),
      })
      : await window.cineWatchApi.getDiscoveryRecommendations(filters);
    state.senseResults = data.movies;
    renderMovieCards(
      senseResultsList,
      state.senseResults,
      "No movies match those filters yet.",
    );
    showMessage(`Found ${state.senseResults.length} CineSense recommendations.`);
  } catch (error) {
    showApiError(error);
  }
}

async function runRandomPicker() {
  try {
    const data = await window.cineWatchApi.getRandomMovie(readSenseFilters());
    state.senseResults = data.movie ? [data.movie] : [];
    renderMovieCards(
      senseResultsList,
      state.senseResults,
      "No random pick matched those filters.",
    );
    showMessage(data.movie ? "Random pick ready." : "No random pick found.");
  } catch (error) {
    showApiError(error);
  }
}

async function toggleWatchlist(movieId, isInWatchlist) {
  try {
    const userId = getId(state.user);

    if (isInWatchlist) {
      await window.cineWatchApi.removeFromWatchlist(userId, movieId);
      showMessage("Removed from watchlist.");
    } else {
      await window.cineWatchApi.addToWatchlist(userId, movieId);
      showMessage("Added to watchlist.");
    }

    await refreshUserData();
    await loadRecommendations();
    renderHero();
    renderMovies();
    renderWatchlist();
    renderRecommendations();
    renderDashboard();
  } catch (error) {
    showApiError(error);
  }
}

async function saveRating(movieId, score, review = "") {
  try {
    await window.cineWatchApi.rateMovie(getId(state.user), movieId, score, review);
    showMessage(`Rated ${score}/10.`);
    await refreshUserData();
    await loadRecommendations();
    renderHero();
    renderMovies();
    renderRecommendations();
    renderDashboard();
  } catch (error) {
    showApiError(error);
  }
}

async function showSimilarMovies(movieId, title) {
  try {
    const data = await window.cineWatchApi.getSimilarMovies(movieId);
    state.similarMovies = data.movies;
    renderSimilarMovies();
    showMessage(`Showing movies similar to ${title}.`);
  } catch (error) {
    showApiError(error);
  }
}

async function openMovieDetails(movieId) {
  try {
    showMessage("Loading movie details...");
    const [movieData, similarData] = await Promise.all([
      window.cineWatchApi.getMovie(movieId),
      window.cineWatchApi.getSimilarMovies(movieId),
    ]);

    renderModalMovie(movieData.movie, similarData.movies);
    movieModal.showModal();
    showMessage("Ready.");
  } catch (error) {
    showApiError(error);
  }
}

async function importTmdbMovie(tmdbId) {
  try {
    await window.cineWatchApi.importTmdbMovie(tmdbId);
    state.tmdbResults = state.tmdbResults.filter((movie) => String(movie.tmdbId) !== String(tmdbId));
    renderTmdbResults();
    showMessage("Imported movie into CineWatch.");
    await renderApp(searchInput.value.trim());
  } catch (error) {
    showApiError(error);
  }
}

movieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(movieForm);
  const releaseYear = formData.get("releaseYear");
  const genres = formData
    .get("genres")
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);

  try {
    await window.cineWatchApi.createMovie({
      title: formData.get("title"),
      releaseYear: releaseYear ? Number(releaseYear) : undefined,
      genres,
    });

    movieForm.reset();
    showMessage("Movie added.");
    await renderApp(searchInput.value.trim());
  } catch (error) {
    showApiError(error);
  }
});

tmdbForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = tmdbQuery.value.trim();

  if (!query) {
    showMessage("Enter a movie name to search TMDB.");
    return;
  }

  try {
    const data = await window.cineWatchApi.searchTmdbMovies(query);
    state.tmdbResults = data.movies;
    saveSearch(query);
    renderTmdbResults();
    showMessage(`Found ${state.tmdbResults.length} TMDB results.`);
  } catch (error) {
    showApiError(error);
  }
});

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchInput.searchTimeout);
  searchInput.searchTimeout = window.setTimeout(() => {
    const query = searchInput.value.trim();
    saveSearch(query);
    renderApp(query);
  }, 250);
});

menuToggle.addEventListener("click", () => {
  setMenuOpen(!appMenu.classList.contains("open"));
});

menuBackdrop.addEventListener("click", () => setMenuOpen(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }
});

for (const button of menuLinks) {
  button.addEventListener("click", () => switchView(button.dataset.view));
}

heroCinesenseButton.addEventListener("click", () => switchView("cinesense"));
heroDashboardButton.addEventListener("click", () => switchView("dashboard"));
heroDetailsButton.addEventListener("click", () => {
  if (state.featuredMovieId) {
    openMovieDetails(state.featuredMovieId);
  }
});

senseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await runCineSense();
});

randomButton.addEventListener("click", runRandomPicker);

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(historyKey);
  renderSearchHistory();
  showMessage("Search history cleared.");
});

modalClose.addEventListener("click", () => movieModal.close());

movieModal.addEventListener("click", (event) => {
  if (event.target === movieModal) {
    movieModal.close();
  }
});

renderApp();
