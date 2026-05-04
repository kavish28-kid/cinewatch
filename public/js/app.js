"use strict";

const activeUser = document.querySelector("#active-user");
const authClose = document.querySelector("#auth-close");
const authCopy = document.querySelector("#auth-copy");
const authDialog = document.querySelector("#auth-dialog");
const authEmail = document.querySelector("#auth-email");
const authForm = document.querySelector("#auth-form");
const authLoginTab = document.querySelector("#auth-login-tab");
const authLogout = document.querySelector("#auth-logout");
const authName = document.querySelector("#auth-name");
const authNameLabel = document.querySelector("#auth-name-label");
const authOpen = document.querySelector("#auth-open");
const authPassword = document.querySelector("#auth-password");
const authRegisterTab = document.querySelector("#auth-register-tab");
const authSubmit = document.querySelector("#auth-submit");
const authTitle = document.querySelector("#auth-title");
const clearHistoryButton = document.querySelector("#clear-history");
const cinebotForm = document.querySelector("#cinebot-form");
const cinebotPrompt = document.querySelector("#cinebot-prompt");
const cinebotThread = document.querySelector("#cinebot-thread");
const choiceCancel = document.querySelector("#choice-cancel");
const choiceConfirm = document.querySelector("#choice-confirm");
const choiceCopy = document.querySelector("#choice-copy");
const choiceDialog = document.querySelector("#choice-dialog");
const choiceKicker = document.querySelector("#choice-kicker");
const choiceTitle = document.querySelector("#choice-title");
const cineverseCanvas = document.querySelector("#cineverse-canvas");
const demoUserButton = document.querySelector("#demo-user-button");
const detailsPageContent = document.querySelector("#details-page-content");
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
const hiddenWorldPicksList = document.querySelector("#hidden-world-picks");
const industryButtons = document.querySelector("#industry-buttons");
const japanPicksList = document.querySelector("#japan-picks");
const koreanPicksList = document.querySelector("#korean-picks");
const recommendationsList = document.querySelector("#recommendations");
const randomButton = document.querySelector("#random-button");
const quizForm = document.querySelector("#quiz-form");
const quizResultsList = document.querySelector("#quiz-results");
const senseForm = document.querySelector("#sense-form");
const senseResultsList = document.querySelector("#sense-results");
const similarMoviesList = document.querySelector("#similar-movies");
const menuLinks = document.querySelectorAll(".menu-link");
const tmdbForm = document.querySelector("#tmdb-form");
const tmdbQuery = document.querySelector("#tmdb-query");
const tmdbResultsList = document.querySelector("#tmdb-results");
const toastStack = document.querySelector("#toast-stack");
const watchlistList = document.querySelector("#watchlist");
const favoriteGenres = document.querySelector("#favorite-genres");
const hindiPicksList = document.querySelector("#hindi-picks");
const hollywoodPicksList = document.querySelector("#hollywood-picks");
const message = document.querySelector("#message");
const searchInput = document.querySelector("#search");
const tasteModeButtons = document.querySelector("#taste-mode-buttons");
const tasteOrbitCanvas = document.querySelector("#taste-orbit-canvas");
const tasteOrbitCopy = document.querySelector("#taste-orbit-copy");
const tasteOrbitFallback = document.querySelector("#taste-orbit-fallback");
const tasteOrbitTitle = document.querySelector("#taste-orbit-title");
const topRatedWorldList = document.querySelector("#top-rated-world");
const tollywoodPicksList = document.querySelector("#tollywood-picks");
const trendingWorldList = document.querySelector("#trending-world");
const views = document.querySelectorAll(".app-view");

const state = {
  movies: [],
  recommendations: [],
  quizResults: [],
  tasteMode: "safe",
  ratingsByMovieId: new Map(),
  similarMovies: [],
  senseResults: [],
  tmdbResults: [],
  user: null,
  activeDetailMovieId: null,
  featuredMovieId: null,
  loading: new Set(),
  homeCollections: {
    hindi: [],
    hiddenWorld: [],
    hollywood: [],
    japan: [],
    korean: [],
    topRated: [],
    tollywood: [],
    trending: [],
  },
  watchlistByMovieId: new Map(),
};

const historyKey = "cinewatch-search-history";
const userKey = "cinewatch-active-user-id";
let authMode = "login";
let choiceResolver = null;
const industryLabels = {
  anime: "Anime",
  arabic: "Arabic Cinema",
  bengali: "Bengali Cinema",
  bollywood: "Bollywood",
  chinese: "Chinese Cinema",
  cult: "Cult & Uncommon",
  documentary: "Documentary",
  french: "French Cinema",
  "hidden-world": "Hidden World Cinema",
  hollywood: "Hollywood",
  iranian: "Iranian Cinema",
  japanese: "Japanese Cinema",
  kollywood: "Kollywood",
  marathi: "Marathi Cinema",
  mollywood: "Mollywood",
  sandalwood: "Sandalwood",
  spanish: "Spanish Language",
  tollywood: "Tollywood",
  turkish: "Turkish Cinema",
  korean: "Korean Wave",
};
const fallbackPosterUrls = {
  "3 idiots": "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
  avengers: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
  "avengers endgame": "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
  dangal: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg",
  "guardians of the galaxy": "https://upload.wikimedia.org/wikipedia/en/3/33/Guardians_of_the_Galaxy_%28film%29_poster.jpg",
  inception: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
  interstellar: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
  "la la land": "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png",
  "the dark knight": "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
};

const tasteModeConfig = {
  hidden: {
    copy: "High-rated movies with less mainstream pull, built for finding something people usually miss.",
    title: "Hidden Gem Orbit",
  },
  industry: {
    copy: "Same movie hunger, different cinema language: Bollywood, Tollywood, Korean, Japanese, and world picks rotate together.",
    title: "Industry Swap Orbit",
  },
  opposite: {
    copy: "A deliberate mood shift: if your taste leans intense, CineWatch pushes toward lighter or emotional quality picks.",
    title: "Opposite Mood Orbit",
  },
  safe: {
    copy: "A confident orbit of top-rated and popular picks that should feel familiar, strong, and easy to watch.",
    title: "Safe Pick Orbit",
  },
  surprise: {
    copy: "A mixed orbit of popular, hidden, regional, and strange-but-good picks when you want CineWatch to choose.",
    title: "Surprise Orbit",
  },
};

const tasteOrbit = {
  animationId: null,
  camera: null,
  cards: [],
  group: null,
  height: 0,
  movies: [],
  raycaster: null,
  renderer: null,
  scene: null,
  width: 0,
};

const cineverse = {
  animationId: null,
  beams: null,
  camera: null,
  height: 0,
  posterGroup: null,
  posters: [],
  pointerX: 0,
  pointerY: 0,
  posterKeys: "",
  renderer: null,
  rings: [],
  scene: null,
  stars: null,
  tunnel: null,
  width: 0,
};

const tiltSelector = [
  ".movie-card",
  ".tmdb-card",
  ".collection-card",
  ".mini-movie-card",
  ".metric-card",
  ".insight-card",
  ".hero-poster-card",
].join(",");
const tiltActiveSelector = tiltSelector.split(",").map((selector) => `${selector}.is-tilting`).join(",");

function getId(record) {
  return record ? record.id || record._id : undefined;
}

function showMessage(text) {
  message.textContent = text;
}

function showToast(title, body = "", variant = "default") {
  const toast = document.createElement("div");
  toast.className = `toast ${variant}`.trim();

  const heading = document.createElement("strong");
  heading.textContent = title;
  toast.appendChild(heading);

  if (body) {
    const copy = document.createElement("span");
    copy.textContent = body;
    toast.appendChild(copy);
  }

  toastStack.appendChild(toast);
  window.setTimeout(() => toast.classList.add("visible"), 20);
  window.setTimeout(() => {
    toast.classList.remove("visible");
    window.setTimeout(() => toast.remove(), 220);
  }, 3600);
}

function resolveChoice(value) {
  if (choiceResolver) {
    choiceResolver(value);
    choiceResolver = null;
  }

  choiceDialog.close();
}

function askChoice({ title, copy, confirmText = "Continue", kicker = "CineWatch", danger = false }) {
  choiceKicker.textContent = kicker;
  choiceTitle.textContent = title;
  choiceCopy.textContent = copy;
  choiceConfirm.textContent = confirmText;
  choiceConfirm.classList.toggle("danger", danger);
  choiceConfirm.classList.toggle("secondary", danger);
  choiceDialog.showModal();

  return new Promise((resolve) => {
    choiceResolver = resolve;
  });
}

function setLoading(key, isLoading, text = "Working...") {
  if (isLoading) {
    state.loading.add(key);
    showMessage(text);
  } else {
    state.loading.delete(key);
  }
}

function isLoading(key) {
  return state.loading.has(key);
}

function showApiError(error) {
  if (error.message.toLowerCase().includes("invalid api key")) {
    showMessage("TMDB key is invalid on Render. Update TMDB_API_KEY in Render, then redeploy.");
    showToast("TMDB key issue", "Update the Render environment variable.", "danger");
    return;
  }

  showToast("Action failed", error.message, "danger");
  showMessage(
    error.message === "database connection unavailable"
      ? "Database is offline. Check MongoDB Atlas Network Access or switch to mobile hotspot."
      : error.message,
  );
}

function userLabel(user) {
  return user ? `Using ${user.name || user.email}` : "Loading profile...";
}

function setActiveUser(user, { persist = true } = {}) {
  state.user = user;
  activeUser.textContent = userLabel(user);
  authOpen.textContent = user ? user.name || "Account" : "Account";

  if (persist && user) {
    localStorage.setItem(userKey, getId(user));
  }
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === "register";
  authLoginTab.classList.toggle("active", !isRegister);
  authRegisterTab.classList.toggle("active", isRegister);
  authName.classList.toggle("visible", isRegister);
  authNameLabel.classList.toggle("visible", isRegister);
  authName.required = isRegister;
  authPassword.autocomplete = isRegister ? "new-password" : "current-password";
  authTitle.textContent = isRegister ? "Create account" : "Sign in";
  authCopy.textContent = isRegister
    ? "Create a profile for your own watchlist, ratings, and reviews."
    : state.user
      ? `Currently using ${state.user.name || state.user.email}. Login to switch profile.`
      : "Sign in to continue your CineWatch taste profile.";
  authSubmit.textContent = isRegister ? "Create Account" : "Login";
  authLogout.disabled = !state.user;
}

async function useDemoUser({ persist = true } = {}) {
  const data = await window.cineWatchApi.getDemoUser();
  setActiveUser(data.user, { persist });
}

async function loadStoredUser() {
  const savedUserId = localStorage.getItem(userKey);

  if (!savedUserId) {
    await useDemoUser({ persist: true });
    return;
  }

  try {
    const data = await window.cineWatchApi.getUser(savedUserId);
    setActiveUser(data.user, { persist: true });
  } catch (error) {
    localStorage.removeItem(userKey);
    await useDemoUser({ persist: true });
  }
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

function posterKey(title = "") {
  return String(title)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function posterUrlFor(movie) {
  return movie.posterUrl || fallbackPosterUrls[posterKey(movie.title)] || "";
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
  const posterUrl = posterUrlFor(movie);

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

  const featuredMovies = uniqueMovies([
    ...state.recommendations,
    ...state.homeCollections.trending,
    ...state.homeCollections.topRated,
    ...state.homeCollections.hindi,
    ...state.homeCollections.hollywood,
    ...state.homeCollections.tollywood,
    ...state.homeCollections.korean,
    ...state.homeCollections.hiddenWorld,
    ...state.movies,
  ])
    .filter((movie) => posterUrlFor(movie))
    .sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0))
    .slice(0, 9);

  if (featuredMovies.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Import movies to start the poster roll.";
    heroPosters.appendChild(empty);
    return;
  }

  const track = document.createElement("div");
  track.className = "hero-reel-track";

  for (const [index, movie] of [...featuredMovies, ...featuredMovies].entries()) {
    const button = document.createElement("button");
    button.className = "hero-poster-card";
    button.type = "button";
    button.style.setProperty("--reel-index", index);
    button.addEventListener("click", () => openTasteMovie(movie));

    const label = document.createElement("span");
    label.textContent = `${movie.title}${movie.imdbRating ? ` | ${movie.imdbRating}/10` : ""}`;

    button.append(createPoster(movie), label);
    track.appendChild(button);
  }

  heroPosters.appendChild(track);
}

function uniqueMovies(movies) {
  const seen = new Set();

  return movies.filter((movie) => {
    const key = movie.tmdbId ? `tmdb:${movie.tmdbId}` : getId(movie) || movie.externalId || movie.title;

    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function shuffleMovies(movies) {
  return [...movies]
    .map((movie) => ({ movie, score: Math.random() }))
    .sort((a, b) => a.score - b.score)
    .map((item) => item.movie);
}

function allDiscoveryMovies() {
  return uniqueMovies([
    ...state.recommendations,
    ...state.homeCollections.trending,
    ...state.homeCollections.topRated,
    ...state.homeCollections.hindi,
    ...state.homeCollections.hollywood,
    ...state.homeCollections.tollywood,
    ...state.homeCollections.korean,
    ...state.homeCollections.japan,
    ...state.homeCollections.hiddenWorld,
    ...state.movies,
  ]).filter((movie) => posterUrlFor(movie));
}

function favoriteTasteGenres() {
  const scores = new Map();

  for (const rating of state.ratingsByMovieId.values()) {
    for (const genre of rating.movie?.genres || []) {
      scores.set(genre, (scores.get(genre) || 0) + rating.score);
    }
  }

  for (const item of state.watchlistByMovieId.values()) {
    for (const genre of item.movie?.genres || []) {
      scores.set(genre, (scores.get(genre) || 0) + 4);
    }
  }

  return [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([genre]) => genre);
}

function tasteMoviesForMode(mode) {
  const base = allDiscoveryMovies();
  const sortedBase = [...base].sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0));
  const industryMix = uniqueMovies([
    ...state.homeCollections.tollywood,
    ...state.homeCollections.korean,
    ...state.homeCollections.japan,
    ...state.homeCollections.hindi,
    ...state.homeCollections.hiddenWorld,
  ]).filter((movie) => posterUrlFor(movie));

  if (mode === "hidden") {
    return uniqueMovies([...state.homeCollections.hiddenWorld, ...sortedBase]).slice(0, 10);
  }

  if (mode === "industry") {
    return uniqueMovies([...industryMix, ...sortedBase]).slice(0, 10);
  }

  if (mode === "opposite") {
    const favoriteGenres = favoriteTasteGenres();
    const oppositeGenres = favoriteGenres.some((genre) => ["Action", "Horror", "Thriller", "Crime"].includes(genre))
      ? ["Comedy", "Romance", "Drama", "Family"]
      : ["Thriller", "Mystery", "Sci-Fi", "Action"];
    const oppositeMovies = base.filter((movie) => (
      movie.genres || []
    ).some((genre) => oppositeGenres.includes(genre)));

    return uniqueMovies([...oppositeMovies, ...state.homeCollections.hiddenWorld, ...sortedBase]).slice(0, 10);
  }

  if (mode === "surprise") {
    return shuffleMovies(uniqueMovies([...industryMix, ...state.homeCollections.trending, ...sortedBase])).slice(0, 10);
  }

  return uniqueMovies([...state.recommendations, ...state.homeCollections.trending, ...state.homeCollections.topRated, ...sortedBase]).slice(0, 10);
}

function renderTasteFallback(movies) {
  tasteOrbitFallback.innerHTML = "";

  for (const movie of movies.slice(0, 5)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "taste-orbit-chip";
    button.addEventListener("click", () => openTasteMovie(movie));

    const title = document.createElement("strong");
    title.textContent = movie.title;

    const meta = document.createElement("span");
    meta.textContent = movieSubtitle(movie) || "CineTaste pick";

    button.append(createPoster(movie, "taste-chip-poster"), title, meta);
    tasteOrbitFallback.appendChild(button);
  }
}

function makeFallbackTexture(movie) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 512, 768);
  gradient.addColorStop(0, "#172033");
  gradient.addColorStop(1, "#05070b");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(255,255,255,0.16)";
  context.fillRect(34, 34, 444, 700);
  context.fillStyle = "#f8e3a9";
  context.font = "700 54px Inter, Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(initials(movie.title), 256, 350);
  context.fillStyle = "#f4f7fb";
  context.font = "700 30px Inter, Arial";
  context.fillText((movie.genres?.[0] || "CineWatch").slice(0, 18), 256, 430);

  return new THREE.CanvasTexture(canvas);
}

function disposeTasteOrbitCards() {
  for (const card of tasteOrbit.cards) {
    if (card.material.map) card.material.map.dispose();
    card.material.dispose();
    card.geometry.dispose();
  }

  tasteOrbit.cards = [];
  if (tasteOrbit.group) tasteOrbit.group.clear();
}

function sizeTasteOrbit() {
  if (!tasteOrbit.renderer || !tasteOrbitCanvas) return;

  const rect = tasteOrbitCanvas.parentElement.getBoundingClientRect();
  const width = Math.max(Math.floor(rect.width), 320);
  const height = Math.max(Math.floor(rect.height), 260);

  if (width === tasteOrbit.width && height === tasteOrbit.height) return;

  tasteOrbit.width = width;
  tasteOrbit.height = height;
  tasteOrbit.renderer.setSize(width, height, false);
  tasteOrbit.camera.aspect = width / height;
  tasteOrbit.camera.updateProjectionMatrix();
}

function initTasteOrbit() {
  if (!tasteOrbitCanvas || !window.THREE || tasteOrbit.renderer) return Boolean(tasteOrbit.renderer);

  tasteOrbit.scene = new THREE.Scene();
  tasteOrbit.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  tasteOrbit.camera.position.set(0, 0.3, 7.2);
  tasteOrbit.group = new THREE.Group();
  tasteOrbit.scene.add(tasteOrbit.group);
  tasteOrbit.raycaster = new THREE.Raycaster();
  tasteOrbit.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: tasteOrbitCanvas,
    preserveDrawingBuffer: true,
  });
  tasteOrbit.renderer.setClearColor(0x000000, 0);
  tasteOrbit.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  tasteOrbitCanvas.addEventListener("click", (event) => {
    sizeTasteOrbit();
    const rect = tasteOrbitCanvas.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    tasteOrbit.raycaster.setFromCamera(pointer, tasteOrbit.camera);
    const [hit] = tasteOrbit.raycaster.intersectObjects(tasteOrbit.cards);

    if (hit?.object?.userData?.movie) {
      openTasteMovie(hit.object.userData.movie);
    }
  });

  window.addEventListener("resize", sizeTasteOrbit);
  sizeTasteOrbit();
  return true;
}

function renderTasteOrbit3d(movies) {
  if (!initTasteOrbit()) return;

  disposeTasteOrbitCards();
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  const count = Math.min(movies.length, window.innerWidth < 640 ? 6 : 10);
  const radius = window.innerWidth < 640 ? 3.2 : 4.2;

  for (const [index, movie] of movies.slice(0, count).entries()) {
    const angle = (index / count) * Math.PI * 2;
    const geometry = new THREE.PlaneGeometry(1.05, 1.58);
    const texture = makeFallbackTexture(movie);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.sin(angle) * radius, Math.sin(index * 0.9) * 0.16, Math.cos(angle) * radius);
    mesh.rotation.y = angle + Math.PI;
    mesh.userData.movie = movie;
    tasteOrbit.group.add(mesh);
    tasteOrbit.cards.push(mesh);

    const posterUrl = posterUrlFor(movie);
    if (posterUrl) {
      loader.load(posterUrl, (loadedTexture) => {
        material.map.dispose();
        material.map = loadedTexture;
        material.needsUpdate = true;
      });
    }
  }

  if (!tasteOrbit.animationId) {
    animateTasteOrbit();
  }
}

function animateTasteOrbit() {
  sizeTasteOrbit();
  tasteOrbit.group.rotation.y += 0.004;

  for (const [index, card] of tasteOrbit.cards.entries()) {
    card.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0007;
  }

  tasteOrbit.renderer.render(tasteOrbit.scene, tasteOrbit.camera);
  tasteOrbit.animationId = window.requestAnimationFrame(animateTasteOrbit);
}

function openTasteMovie(movie) {
  const movieId = getId(movie);

  if (movieId) {
    openMovieDetails(movieId);
    return;
  }

  if (movie.tmdbId) {
    requestImportMovie(movie);
  }
}

function renderTasteOrbit(mode = state.tasteMode) {
  if (!tasteOrbitTitle || !tasteOrbitFallback) return;

  state.tasteMode = mode;
  const config = tasteModeConfig[mode] || tasteModeConfig.safe;
  const movies = tasteMoviesForMode(mode);
  tasteOrbitTitle.textContent = config.title;
  tasteOrbitCopy.textContent = config.copy;
  tasteOrbit.movies = movies;

  for (const button of tasteModeButtons.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.tasteMode === mode);
  }

  renderTasteFallback(movies);

  if (movies.length > 0) {
    renderTasteOrbit3d(movies);
  }
}

function sizeCineverse() {
  if (!cineverse.renderer || !cineverseCanvas) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width === cineverse.width && height === cineverse.height) return;

  cineverse.width = width;
  cineverse.height = height;
  cineverse.renderer.setSize(width, height, false);
  cineverse.camera.aspect = width / height;
  cineverse.camera.updateProjectionMatrix();
}

function createCineverseStars() {
  const isMobile = window.innerWidth < 720;
  const count = isMobile ? 220 : 420;
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 24;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[index * 3 + 2] = -Math.random() * 34 + 8;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xeef6ff,
    opacity: 0.62,
    size: isMobile ? 0.025 : 0.032,
    transparent: true,
  });

  return new THREE.Points(geometry, material);
}

function createCineverseTunnel() {
  const tunnel = new THREE.Group();
  const ringMaterial = new THREE.LineBasicMaterial({
    color: 0xd8bb73,
    opacity: 0.22,
    transparent: true,
  });
  const railMaterial = new THREE.LineBasicMaterial({
    color: 0x8cc7ff,
    opacity: 0.16,
    transparent: true,
  });
  const points = [];
  const segments = 96;

  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * 5.3, Math.sin(angle) * 3.15, 0));
  }

  for (let index = 0; index < 18; index += 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const ring = new THREE.LineLoop(geometry, ringMaterial.clone());
    ring.position.z = -24 + index * 1.9;
    ring.rotation.z = index * 0.12;
    tunnel.add(ring);
    cineverse.rings.push(ring);
  }

  for (const [x, y] of [[-5.4, -2.9], [5.4, -2.9], [-5.4, 2.9], [5.4, 2.9]]) {
    const railGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, y, 8),
      new THREE.Vector3(x * 0.55, y * 0.55, -28),
    ]);
    const rail = new THREE.Line(railGeometry, railMaterial.clone());
    tunnel.add(rail);
  }

  return tunnel;
}

function createCineverseBeams() {
  const beams = new THREE.Group();
  const colors = [0xd8bb73, 0x8cc7ff, 0xffffff];

  for (let index = 0; index < colors.length; index += 1) {
    const material = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: colors[index],
      depthWrite: false,
      opacity: index === 2 ? 0.04 : 0.07,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.2), material);
    beam.position.set((index - 1) * 2.6, index * 0.35 - 0.3, -4 - index * 1.8);
    beam.rotation.z = (index - 1) * 0.24;
    beam.rotation.y = (index - 1) * 0.18;
    beams.add(beam);
  }

  return beams;
}

function initCineverse() {
  if (!cineverseCanvas || !window.THREE || cineverse.renderer) return Boolean(cineverse.renderer);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) return false;

  cineverse.scene = new THREE.Scene();
  cineverse.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  cineverse.camera.position.set(0, 0.15, 7.8);
  cineverse.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: cineverseCanvas,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  cineverse.renderer.setClearColor(0x000000, 0);
  cineverse.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));

  cineverse.stars = createCineverseStars();
  cineverse.tunnel = createCineverseTunnel();
  cineverse.beams = createCineverseBeams();
  cineverse.posterGroup = new THREE.Group();

  cineverse.scene.add(cineverse.stars, cineverse.tunnel, cineverse.beams, cineverse.posterGroup);
  sizeCineverse();
  window.addEventListener("resize", sizeCineverse);
  document.body.classList.add("cineverse-ready");

  if (!cineverse.animationId) animateCineverse();

  return true;
}

function disposeCineversePosters() {
  for (const poster of cineverse.posters) {
    if (poster.material.map) poster.material.map.dispose();
    poster.material.dispose();
    poster.geometry.dispose();
  }

  cineverse.posters = [];
  if (cineverse.posterGroup) cineverse.posterGroup.clear();
}

function seedCineverseMovies(movies) {
  if (movies.length > 0) return movies;

  return [
    { genres: ["CineWatch"], title: "Poster Universe" },
    { genres: ["CineSense"], title: "Mood Engine" },
    { genres: ["Watchlist"], title: "Private Queue" },
    { genres: ["World"], title: "Hidden Cinema" },
    { genres: ["AI"], title: "Taste Signal" },
  ];
}

function rebuildCineversePosters(movies) {
  if (!initCineverse()) return;

  const isMobile = window.innerWidth < 720;
  const selectedMovies = seedCineverseMovies(movies).slice(0, isMobile ? 8 : 14);
  const keys = selectedMovies.map((movie) => movie.tmdbId || getId(movie) || movie.title).join("|");

  if (keys === cineverse.posterKeys) return;

  cineverse.posterKeys = keys;
  disposeCineversePosters();

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");

  for (const [index, movie] of selectedMovies.entries()) {
    const texture = makeFallbackTexture(movie);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 1.1), material);
    const side = index % 2 === 0 ? -1 : 1;
    const lane = Math.floor(index / 2);
    mesh.position.set(side * (3.35 + (lane % 3) * 0.28), -1.35 + (lane % 4) * 0.74, -2.3 - lane * 1.45);
    mesh.rotation.y = side * -0.68;
    mesh.rotation.z = side * 0.045;
    mesh.userData.baseY = mesh.position.y;
    cineverse.posterGroup.add(mesh);
    cineverse.posters.push(mesh);

    const posterUrl = posterUrlFor(movie);
    if (posterUrl) {
      loader.load(posterUrl, (loadedTexture) => {
        material.map.dispose();
        material.map = loadedTexture;
        material.needsUpdate = true;
      });
    }
  }
}

function renderCineverseBackdrop() {
  const movies = uniqueMovies([
    ...state.homeCollections.topRated,
    ...state.homeCollections.trending,
    ...state.recommendations,
    ...state.homeCollections.hiddenWorld,
    ...state.homeCollections.korean,
    ...state.homeCollections.hindi,
    ...state.movies,
  ]).filter((movie) => posterUrlFor(movie));

  rebuildCineversePosters(movies);
}

function animateCineverse() {
  sizeCineverse();
  const time = Date.now() * 0.001;
  const scrollDrift = Math.min(window.scrollY / Math.max(window.innerHeight * 3, 1), 1);

  cineverse.camera.position.x += (cineverse.pointerX * 0.45 - cineverse.camera.position.x) * 0.035;
  cineverse.camera.position.y += (-cineverse.pointerY * 0.28 + 0.12 - cineverse.camera.position.y) * 0.035;
  cineverse.camera.position.z = 7.8 - scrollDrift * 1.2;
  cineverse.camera.lookAt(0, 0, -8);

  if (cineverse.stars) {
    cineverse.stars.rotation.y += 0.00045;
    cineverse.stars.position.z = Math.sin(time * 0.18) * 0.25;
  }

  if (cineverse.tunnel) {
    cineverse.tunnel.rotation.z += 0.0009;
  }

  for (const ring of cineverse.rings) {
    ring.position.z += 0.028;
    ring.material.opacity = 0.12 + Math.max(0, ring.position.z + 24) * 0.004;
    if (ring.position.z > 8) ring.position.z = -26;
  }

  if (cineverse.beams) {
    cineverse.beams.rotation.z = Math.sin(time * 0.22) * 0.045;
  }

  for (const [index, poster] of cineverse.posters.entries()) {
    poster.position.y = poster.userData.baseY + Math.sin(time * 0.7 + index) * 0.08;
    poster.position.z += 0.005;
    if (poster.position.z > 1.2) poster.position.z = -10.5 - (index % 5);
  }

  cineverse.renderer.render(cineverse.scene, cineverse.camera);
  cineverse.animationId = window.requestAnimationFrame(animateCineverse);
}

function updateCineversePointer(event) {
  cineverse.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  cineverse.pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
}

function closestTiltCard(target) {
  return target instanceof Element ? target.closest(tiltSelector) : null;
}

function handleCardTilt(event) {
  if (!window.matchMedia("(hover: hover)").matches || window.innerWidth < 780) return;

  const card = closestTiltCard(event.target);

  document.querySelectorAll(tiltActiveSelector).forEach((activeCard) => {
    if (activeCard !== card) activeCard.classList.remove("is-tilting");
  });

  if (!card) return;

  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  card.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
  card.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
  card.classList.add("is-tilting");
}

function clearCardTilt(event) {
  const card = closestTiltCard(event.target);

  if (card) {
    card.classList.remove("is-tilting");
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  }
}

function renderCollection(listElement, movies, emptyText) {
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
    item.className = "collection-card";

    const importButton = document.createElement("button");
    importButton.type = "button";
    importButton.textContent = "Import";
    importButton.addEventListener("click", () => requestImportMovie(movie));

    const title = document.createElement("strong");
    title.textContent = movie.title;

    const meta = document.createElement("span");
    meta.textContent = movieSubtitle(movie) || "World pick";

    item.append(createPoster(movie), title, meta, importButton);
    listElement.appendChild(item);
  }
}

function renderHomeCollections() {
  renderCollection(trendingWorldList, state.homeCollections.trending, "Trending picks are loading.");
  renderCollection(topRatedWorldList, state.homeCollections.topRated, "Top-rated picks are loading.");
  renderCollection(hindiPicksList, state.homeCollections.hindi, "Bollywood picks are loading.");
  renderCollection(hollywoodPicksList, state.homeCollections.hollywood, "Hollywood picks are loading.");
  renderCollection(tollywoodPicksList, state.homeCollections.tollywood, "Tollywood picks are loading.");
  renderCollection(koreanPicksList, state.homeCollections.korean, "Korean picks are loading.");
  renderCollection(japanPicksList, state.homeCollections.japan, "Anime and Japanese picks are loading.");
  renderCollection(hiddenWorldPicksList, state.homeCollections.hiddenWorld, "Hidden world picks are loading.");
}

function createMiniResultCard(movie) {
  const item = document.createElement("li");
  item.className = "mini-movie-card";

  const details = document.createElement("div");
  details.className = "mini-movie-copy";

  const title = document.createElement("strong");
  title.textContent = movie.title;

  const meta = document.createElement("span");
  meta.textContent = movieSubtitle(movie) || "World-ranked pick";

  details.append(title, meta);

  if (movie.recommendationReason) {
    const reason = document.createElement("p");
    reason.textContent = movie.recommendationReason;
    details.appendChild(reason);
  }

  const importButton = document.createElement("button");
  importButton.type = "button";
  importButton.textContent = "Import";
  importButton.disabled = !movie.tmdbId;
  importButton.addEventListener("click", () => requestImportMovie(movie));

  item.append(createPoster(movie, "mini-poster"), details, importButton);
  return item;
}

function renderMiniResults(listElement, movies, emptyText) {
  listElement.innerHTML = "";

  if (movies.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = emptyText;
    listElement.appendChild(item);
    return;
  }

  for (const movie of movies) {
    listElement.appendChild(createMiniResultCard(movie));
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
    const isStoredMovie = Boolean(movieId);
    const watchlistItem = isStoredMovie ? state.watchlistByMovieId.get(movieId) : null;
    const rating = isStoredMovie ? state.ratingsByMovieId.get(movieId) : null;
    const item = document.createElement("li");
    item.className = "movie-card";
    const poster = createPoster(movie, "card-poster");

    const details = document.createElement("div");
    details.className = "movie-details";

    const title = document.createElement("h3");
    title.textContent = movie.title;
    if (isStoredMovie) {
      title.tabIndex = 0;
      title.className = "clickable-title";
      title.addEventListener("click", () => openMovieDetails(movieId));
      title.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openMovieDetails(movieId);
        }
      });
    }

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
    ratingText.textContent = isStoredMovie
      ? (rating ? `Rated ${rating.score}/10` : "Not rated")
      : "World pick";
    const reviewText = document.createElement("p");
    reviewText.className = "review-snippet";
    reviewText.textContent = rating?.review ? `"${rating.review}"` : "";

    details.append(title, subtitle);

    if (credit.textContent) details.appendChild(credit);
    if (overview.textContent) details.appendChild(overview);

    if (isStoredMovie) {
      details.append(stats, ratingText);
    } else {
      details.appendChild(ratingText);
    }

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

    if (!isStoredMovie && movie.tmdbId) {
      const importButton = document.createElement("button");
      importButton.type = "button";
      importButton.textContent = "Import";
      importButton.addEventListener("click", () => requestImportMovie(movie));

      controls.appendChild(importButton);
      item.append(poster, details, controls);
      listElement.appendChild(item);
      continue;
    }

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

  const trailerButton = document.createElement("button");
  trailerButton.type = "button";
  trailerButton.className = "secondary";
  trailerButton.textContent = "Watch Trailer";

  actions.append(watchlistButton, trailerButton, ratingSelect, rateButton);

  const trailerPanel = document.createElement("section");
  trailerPanel.className = "trailer-panel";
  trailerPanel.hidden = true;
  trailerButton.addEventListener("click", () => openMovieTrailer(movieId, movie.trailerUrl, trailerPanel, movie.title));

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
  details.append(title, subtitle, overview, facts, reviewInput, actions, trailerPanel, similarSection);
  layout.append(createPoster(movie, "detail-poster"), details);
  modalContent.appendChild(layout);
}

function closeDetailsPage() {
  state.activeDetailMovieId = null;
  switchView("browse");
  showMessage("Ready.");
}

function renderDetailsPage(movie, similarMovies = []) {
  const movieId = getId(movie);
  const watchlistItem = state.watchlistByMovieId.get(movieId);
  const rating = state.ratingsByMovieId.get(movieId);
  detailsPageContent.innerHTML = "";

  const pageHeader = document.createElement("div");
  pageHeader.className = "details-page-header";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "secondary details-back-button";
  backButton.textContent = "Back to Browse";
  backButton.addEventListener("click", closeDetailsPage);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "details-close-button";
  closeButton.textContent = "x";
  closeButton.setAttribute("aria-label", "Close movie details");
  closeButton.addEventListener("click", closeDetailsPage);

  pageHeader.append(backButton, closeButton);

  const layout = document.createElement("div");
  layout.className = "details-layout";

  const poster = createPoster(movie, "detail-poster");
  const content = document.createElement("div");
  content.className = "details-copy";

  const kicker = document.createElement("span");
  kicker.className = "eyebrow";
  kicker.textContent = movie.source === "tmdb" ? "TMDB Import" : "CineWatch Library";

  const title = document.createElement("h2");
  title.textContent = movie.title;

  const subtitle = document.createElement("p");
  subtitle.className = "modal-subtitle";
  subtitle.textContent = movieSubtitle(movie) || "Movie details";

  const overview = document.createElement("p");
  overview.className = "modal-overview";
  overview.textContent = movie.overview || "No overview available yet.";

  const facts = document.createElement("div");
  facts.className = "fact-grid";

  for (const [label, value] of [
    ["Director", movie.director || "Unknown"],
    ["Cast", movie.cast && movie.cast.length > 0 ? movie.cast.join(", ") : "Unknown"],
    ["Language", movie.spokenLanguage || "Unknown"],
    ["Runtime", movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : "Unknown"],
    ["Rating", movie.imdbRating ? `${movie.imdbRating}/10` : "Not available"],
    ["CineWatch", statsText(movie)],
  ]) {
    const fact = document.createElement("div");
    const labelElement = document.createElement("span");
    const valueElement = document.createElement("strong");
    labelElement.textContent = label;
    valueElement.textContent = value;
    fact.append(labelElement, valueElement);
    facts.appendChild(fact);
  }

  const reviewInput = document.createElement("textarea");
  reviewInput.className = "review-input";
  reviewInput.placeholder = "Write your review...";
  reviewInput.rows = 4;
  reviewInput.value = rating?.review || "";

  const ratingSelect = document.createElement("select");
  ratingSelect.setAttribute("aria-label", `Rating for ${movie.title}`);

  for (let score = 1; score <= 10; score += 1) {
    const option = document.createElement("option");
    option.value = String(score);
    option.textContent = `${score}/10`;
    ratingSelect.appendChild(option);
  }

  ratingSelect.value = rating ? String(rating.score) : "8";

  const actions = document.createElement("div");
  actions.className = "modal-actions";

  const saveReviewButton = document.createElement("button");
  saveReviewButton.type = "button";
  saveReviewButton.textContent = "Save Rating & Review";
  saveReviewButton.addEventListener("click", () => saveRating(movieId, Number(ratingSelect.value), reviewInput.value.trim()));

  const watchlistButton = document.createElement("button");
  watchlistButton.type = "button";
  watchlistButton.className = watchlistItem ? "secondary danger" : "secondary";
  watchlistButton.textContent = watchlistItem ? "Remove from Watchlist" : "Add to Watchlist";
  watchlistButton.addEventListener("click", () => toggleWatchlist(movieId, Boolean(watchlistItem)));

  const trailerButton = document.createElement("button");
  trailerButton.type = "button";
  trailerButton.className = "secondary";
  trailerButton.textContent = "Watch Trailer";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "secondary danger";
  deleteButton.textContent = "Delete Movie";
  deleteButton.addEventListener("click", () => requestDeleteStoredMovie(movieId, movie.title));

  actions.append(watchlistButton, trailerButton, ratingSelect, saveReviewButton, deleteButton);

  const trailerPanel = document.createElement("section");
  trailerPanel.className = "trailer-panel";
  trailerPanel.hidden = true;
  trailerButton.addEventListener("click", () => openMovieTrailer(movieId, movie.trailerUrl, trailerPanel, movie.title));

  const similarSection = document.createElement("div");
  similarSection.className = "details-similar";
  const similarTitle = document.createElement("h3");
  similarTitle.textContent = "Similar Movies";
  const similarList = document.createElement("ul");
  similarList.className = "side-list";

  if (similarMovies.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = "Import more movies to expand similar picks.";
    similarList.appendChild(item);
  } else {
    for (const similarMovie of similarMovies.slice(0, 6)) {
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
  content.append(kicker, title, subtitle, overview, facts, reviewInput, actions, trailerPanel, similarSection);
  layout.append(poster, content);
  detailsPageContent.append(pageHeader, layout);
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

  if (isLoading("tmdb-search")) {
    for (let index = 0; index < 6; index += 1) {
      const item = document.createElement("li");
      item.className = "tmdb-card skeleton-card";
      item.innerHTML = "<div class=\"poster skeleton-box\"></div><div class=\"movie-details\"><span class=\"skeleton-line wide\"></span><span class=\"skeleton-line\"></span><span class=\"skeleton-line short\"></span></div>";
      tmdbResultsList.appendChild(item);
    }
    return;
  }

  for (const movie of state.tmdbResults) {
    const item = document.createElement("li");
    item.className = "tmdb-card";
    const poster = createPoster(movie);

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
    importButton.addEventListener("click", () => requestImportMovie(movie));

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
    if (!watchlistItem.movie) continue;

    const item = document.createElement("li");
    const movie = watchlistItem.movie;
    const movieId = getId(movie);
    item.className = "watchlist-card";

    const poster = createPoster(movie, "watchlist-poster");
    poster.addEventListener("click", () => openMovieDetails(movieId));

    const copy = document.createElement("div");
    copy.className = "watchlist-copy";

    const title = document.createElement("strong");
    title.textContent = movie.releaseYear ? `${movie.title} (${movie.releaseYear})` : movie.title;

    const meta = document.createElement("span");
    meta.textContent = movieSubtitle(movie) || watchlistItem.status;

    const status = document.createElement("span");
    status.textContent = `Status: ${watchlistItem.status}`;

    copy.append(title, meta, status);

    const actions = document.createElement("div");
    actions.className = "watchlist-actions";

    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "secondary";
    detailsButton.textContent = "Details";
    detailsButton.addEventListener("click", () => openMovieDetails(movieId));

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "secondary danger";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => toggleWatchlist(movieId, true));

    actions.append(detailsButton, removeButton);
    item.append(poster, copy, actions);
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

function renderSenseLoading() {
  senseResultsList.innerHTML = "";

  for (let index = 0; index < 6; index += 1) {
    const item = document.createElement("li");
    item.className = "movie-card skeleton-card";
    item.innerHTML = "<div class=\"poster card-poster skeleton-box\"></div><div class=\"movie-details\"><span class=\"skeleton-line wide\"></span><span class=\"skeleton-line\"></span><span class=\"skeleton-line short\"></span></div><div class=\"movie-actions\"><span class=\"skeleton-button\"></span></div>";
    senseResultsList.appendChild(item);
  }
}

function renderMiniLoading(listElement, count = 4) {
  listElement.innerHTML = "";

  for (let index = 0; index < count; index += 1) {
    const item = document.createElement("li");
    item.className = "mini-movie-card skeleton-card";
    item.innerHTML = "<div class=\"poster mini-poster skeleton-box\"></div><div class=\"mini-movie-copy\"><span class=\"skeleton-line wide\"></span><span class=\"skeleton-line\"></span><span class=\"skeleton-line short\"></span></div><span class=\"skeleton-button\"></span>";
    listElement.appendChild(item);
  }
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
    return (JSON.parse(localStorage.getItem(historyKey)) || []).map((entry) => ({
      filters: entry.filters || {},
      query: entry.query || "",
      searchedAt: entry.searchedAt || "",
      type: entry.type || "library",
      where: entry.where || "Library Search",
    }));
  } catch (error) {
    return [];
  }
}

function filterSummary(filters = {}) {
  const prompt = String(filters.prompt || "").trim();

  if (prompt) return prompt;

  const parts = [];

  if (filters.industry && filters.industry !== "any") {
    parts.push(industryLabels[filters.industry] || filters.industry);
  }

  if (filters.genre && filters.genre !== "any") parts.push(filters.genre);
  if (filters.mood && filters.mood !== "any") parts.push(filters.mood);
  if (filters.minImdbRating) parts.push(`${filters.minImdbRating}+ rating`);
  if (filters.limit) parts.push(`${filters.limit} picks`);

  return parts.length > 0 ? parts.join(" / ") : "World recommendations";
}

function saveSearch(query, { filters = {}, type = "library", where = "Library Search" } = {}) {
  if (!query) return;

  const history = readSearchHistory().filter((item) => (
    item.query !== query || item.where !== where
  ));
  history.unshift({
    filters,
    query,
    searchedAt: new Date().toLocaleString(),
    type,
    where,
  });

  localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 12)));
  renderSearchHistory();
}

async function replaySearchHistory(entry) {
  const filters = entry.filters || {};

  if (entry.type === "tmdb") {
    switchView("browse");
    tmdbQuery.value = entry.query;
    tmdbForm.requestSubmit();
    return;
  }

  if (entry.type === "cinebot") {
    switchView("cinesense");
    cinebotPrompt.value = entry.query;
    cinebotForm.requestSubmit();
    return;
  }

  if (["cinesense", "industry", "mood", "random"].includes(entry.type)) {
    switchView("cinesense");
    senseForm.elements.prompt.value = filters.prompt || entry.query;
    senseForm.elements.industry.value = filters.industry || "any";
    senseForm.elements.genre.value = filters.genre || "any";
    senseForm.elements.mood.value = filters.mood || "any";
    senseForm.elements.minImdbRating.value = filters.minImdbRating || "8";
    senseForm.elements.limit.value = filters.limit || "6";

    if (entry.type === "random") {
      await runRandomPicker();
    } else {
      await runCineSense({ saveHistory: false });
    }

    return;
  }

  searchInput.value = entry.query;
  switchView("browse");
  renderApp(entry.query);
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
    item.className = "history-item";
    const button = document.createElement("button");
    button.className = "secondary";
    button.type = "button";
    button.textContent = entry.query;
    button.addEventListener("click", () => replaySearchHistory(entry).catch(showApiError));

    const meta = document.createElement("div");
    meta.className = "history-meta";

    const where = document.createElement("strong");
    where.textContent = entry.where;

    const searchedAt = document.createElement("span");
    searchedAt.textContent = entry.searchedAt;

    meta.append(where, searchedAt);
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
    watchlistData.watchlist
      .filter((item) => getId(item.movie))
      .map((item) => [getId(item.movie), item]),
  );
  state.ratingsByMovieId = new Map(
    ratingsData.ratings
      .filter((rating) => getId(rating.movie))
      .map((rating) => [getId(rating.movie), rating]),
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

async function loadHomeCollections() {
  const alreadyLoaded = Object.values(state.homeCollections).some((movies) => movies.length > 0);

  if (alreadyLoaded) return;

  const [
    trending,
    topRated,
    hindi,
    hollywood,
    tollywood,
    korean,
    japan,
    hiddenWorld,
  ] = await Promise.allSettled([
    window.cineWatchApi.getWorldRecommendations({ limit: 8, minImdbRating: 7, sort: "popular" }),
    window.cineWatchApi.getWorldRecommendations({ limit: 8, minImdbRating: 8, sort: "top" }),
    window.cineWatchApi.getWorldRecommendations({ industry: "bollywood", limit: 8, minImdbRating: 7, sort: "popular" }),
    window.cineWatchApi.getWorldRecommendations({ industry: "hollywood", limit: 8, minImdbRating: 7.5, sort: "popular" }),
    window.cineWatchApi.getWorldRecommendations({ industry: "tollywood", limit: 8, minImdbRating: 7, sort: "popular" }),
    window.cineWatchApi.getWorldRecommendations({ industry: "korean", limit: 8, minImdbRating: 7, sort: "popular" }),
    window.cineWatchApi.getWorldRecommendations({ industry: "anime", limit: 8, minImdbRating: 7, sort: "popular" }),
    window.cineWatchApi.getWorldRecommendations({ industry: "hidden-world", limit: 8, minImdbRating: 7.2, sort: "top" }),
  ]);

  state.homeCollections.trending = trending.status === "fulfilled" ? trending.value.movies : [];
  state.homeCollections.topRated = topRated.status === "fulfilled" ? topRated.value.movies : [];
  state.homeCollections.hindi = hindi.status === "fulfilled" ? hindi.value.movies : [];
  state.homeCollections.hollywood = hollywood.status === "fulfilled" ? hollywood.value.movies : [];
  state.homeCollections.tollywood = tollywood.status === "fulfilled" ? tollywood.value.movies : [];
  state.homeCollections.korean = korean.status === "fulfilled" ? korean.value.movies : [];
  state.homeCollections.japan = japan.status === "fulfilled" ? japan.value.movies : [];
  state.homeCollections.hiddenWorld = hiddenWorld.status === "fulfilled" ? hiddenWorld.value.movies : [];
}

async function renderApp(search = "") {
  try {
    renderLandingHero();
    renderCineverseBackdrop();

    if (!state.user) await loadStoredUser();

    await Promise.all([loadMovies(search), refreshUserData(), loadRecommendations(), loadHomeCollections()]);
    renderHero();
    renderHeroPosters();
    renderHomeCollections();
    renderTasteOrbit(state.tasteMode);
    renderCineverseBackdrop();
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
    industry: formData.get("industry"),
    limit: formData.get("limit"),
    minImdbRating: formData.get("minImdbRating"),
    mood: formData.get("mood"),
    prompt: formData.get("prompt"),
  };
}

function industryFromText(text = "") {
  const normalized = text.toLowerCase();
  const entries = [
    ["hidden", "hidden-world"],
    ["underrated", "hidden-world"],
    ["uncommon", "hidden-world"],
    ["bollywood", "bollywood"],
    ["hindi", "bollywood"],
    ["hollywood", "hollywood"],
    ["english", "hollywood"],
    ["tollywood", "tollywood"],
    ["telugu", "tollywood"],
    ["kollywood", "kollywood"],
    ["tamil", "kollywood"],
    ["mollywood", "mollywood"],
    ["malayalam", "mollywood"],
    ["sandalwood", "sandalwood"],
    ["kannada", "sandalwood"],
    ["marathi", "marathi"],
    ["bengali", "bengali"],
    ["korean", "korean"],
    ["japanese", "japanese"],
    ["anime", "anime"],
    ["chinese", "chinese"],
    ["spanish", "spanish"],
    ["french", "french"],
    ["turkish", "turkish"],
    ["iranian", "iranian"],
    ["persian", "iranian"],
    ["arabic", "arabic"],
    ["documentary", "documentary"],
    ["cult", "cult"],
  ];

  return entries.find(([needle]) => normalized.includes(needle))?.[1];
}

function languageFromText(text = "") {
  const normalized = text.toLowerCase();

  if (normalized.includes("hindi") || normalized.includes("bollywood")) return "hi";
  if (normalized.includes("korean")) return "ko";
  if (normalized.includes("japanese") || normalized.includes("anime")) return "ja";
  if (normalized.includes("english") || normalized.includes("hollywood")) return "en";

  return undefined;
}

function cinebotFiltersFromPrompt(prompt) {
  const normalized = prompt.toLowerCase();
  const filters = {
    industry: industryFromText(prompt),
    limit: 5,
    minImdbRating: normalized.includes("perfect") || normalized.includes("best") ? 8 : 7,
    prompt,
    sort: normalized.includes("trending") || normalized.includes("popular") ? "popular" : "top",
  };
  const language = languageFromText(prompt);

  if (language) filters.language = language;
  if (normalized.includes("short") || normalized.includes("quick")) filters.maxRuntime = 120;
  if (normalized.includes("long") || normalized.includes("epic")) filters.minRuntime = 140;

  return filters;
}

function appendCinebotMessage(role, text, movies = []) {
  const item = document.createElement("li");
  item.className = `chat-message ${role}`;

  const speaker = document.createElement("strong");
  speaker.textContent = role === "user" ? "You" : "CineBot";

  const copy = document.createElement("span");
  copy.textContent = text;

  item.append(speaker, copy);

  if (movies.length > 0) {
    const results = document.createElement("ul");
    results.className = "chat-results";
    renderMiniResults(results, movies, "No picks found.");
    item.appendChild(results);
  }

  cinebotThread.appendChild(item);

  while (cinebotThread.children.length > 8) {
    cinebotThread.removeChild(cinebotThread.firstElementChild);
  }

  cinebotThread.scrollTop = cinebotThread.scrollHeight;
  return item;
}

function readQuizFilters() {
  const formData = new FormData(quizForm);
  const company = formData.get("company");
  const energy = formData.get("energy");
  const industry = formData.get("industry");
  const runtime = formData.get("runtime");
  const energyMap = {
    emotional: { genre: "Drama", mood: "emotional", words: "emotional drama" },
    horror: { genre: "Horror", mood: "intense", words: "high rated horror thriller" },
    intense: { genre: "Action", mood: "intense", words: "intense action thriller" },
    light: { genre: "Comedy", mood: "fun", words: "light fun comedy" },
    "mind-bending": { genre: "Sci-Fi", mood: "mind-bending", words: "mind-bending sci-fi mystery" },
  };
  const base = energyMap[energy] || energyMap["mind-bending"];
  const filters = {
    genre: base.genre,
    industry,
    limit: 6,
    minImdbRating: 7.2,
    mood: base.mood,
    prompt: `${base.words} for ${company}`,
    sort: "top",
  };

  if (company === "family") {
    filters.genre = "Family";
    filters.mood = "fun";
    filters.prompt = `family friendly ${base.words}`;
  }

  if (company === "date") {
    filters.genre = energy === "horror" ? "Horror" : "Romance";
    filters.mood = energy === "horror" ? "intense" : "romantic";
    filters.prompt = `date night ${base.words}`;
  }

  if (!industry || industry === "any") delete filters.industry;
  if (runtime === "short") filters.maxRuntime = 120;
  if (runtime === "long") filters.minRuntime = 140;

  return filters;
}

async function runCineSense({ saveHistory = true, sourceType = "cinesense", sourceWhere = "CineSense" } = {}) {
  try {
    setLoading("cinesense", true, "Finding world-ranked recommendations...");
    renderSenseLoading();
    const filters = readSenseFilters();
    const data = await window.cineWatchApi.getWorldRecommendations({
      ...filters,
      userId: getId(state.user),
    });
    state.senseResults = data.movies;
    renderMovieCards(
      senseResultsList,
      state.senseResults,
      "No movies match those filters yet.",
    );
    showMessage(`Found ${state.senseResults.length} world-ranked CineSense recommendations.`);
    showToast("CineSense ready", `${state.senseResults.length} world-ranked picks found.`);
    if (saveHistory) {
      saveSearch(filterSummary(filters), {
        filters,
        type: sourceType,
        where: sourceWhere,
      });
    }
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading("cinesense", false);
  }
}

async function runCineBot(event) {
  event.preventDefault();

  const prompt = cinebotPrompt.value.trim();

  if (!prompt) {
    showMessage("Ask CineBot for a movie mood first.");
    showToast("CineBot needs a prompt", "Type a vibe like horror above 8 or short comedy.");
    return;
  }

  appendCinebotMessage("user", prompt);
  cinebotPrompt.value = "";
  const pendingMessage = appendCinebotMessage("bot", "Scanning the world catalog...");

  try {
    setLoading("cinebot", true, "CineBot is reading your mood...");
    const data = await window.cineWatchApi.getWorldRecommendations(cinebotFiltersFromPrompt(prompt));
    pendingMessage.remove();
    appendCinebotMessage(
      "bot",
      data.movies.length > 0
        ? `I found ${data.movies.length} world-ranked matches. Import the one that feels right.`
        : "No clean match came back. Try lowering the rating or changing the genre.",
      data.movies,
    );
    saveSearch(prompt, {
      filters: cinebotFiltersFromPrompt(prompt),
      type: "cinebot",
      where: "CineBot",
    });
    showMessage(`CineBot found ${data.movies.length} picks.`);
    showToast("CineBot answered", `${data.movies.length} world-ranked picks found.`);
  } catch (error) {
    pendingMessage.remove();
    showApiError(error);
  } finally {
    setLoading("cinebot", false);
  }
}

async function runMoodQuiz(event) {
  event.preventDefault();

  try {
    setLoading("mood-quiz", true, "Locking mood and finding movies...");
    renderMiniLoading(quizResultsList, 4);
    const filters = readQuizFilters();
    const data = await window.cineWatchApi.getWorldRecommendations(filters);
    state.quizResults = data.movies;
    renderMiniResults(quizResultsList, state.quizResults, "No mood-lock picks found.");
    showMessage(`Mood Lock found ${state.quizResults.length} picks.`);
    showToast("Mood Lock ready", `${state.quizResults.length} picks for the room.`);
    saveSearch(filterSummary(filters), {
      filters,
      type: "mood",
      where: "Mood Lock",
    });
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading("mood-quiz", false);
  }
}

async function runIndustryLens(industry) {
  if (senseForm.elements.industry) {
    senseForm.elements.industry.value = industry;
  }

  if (senseForm.elements.genre) {
    senseForm.elements.genre.value = "any";
  }

  if (senseForm.elements.prompt) {
    senseForm.elements.prompt.value = "";
  }

  await runCineSense({
    sourceType: "industry",
    sourceWhere: "Industry Lens",
  });
}

async function runRandomPicker() {
  try {
    setLoading("cinesense", true, "Picking a world-ranked movie...");
    renderSenseLoading();
    const filters = readSenseFilters();
    const data = await window.cineWatchApi.getWorldRandomMovie(filters);
    state.senseResults = data.movie ? [data.movie] : [];
    renderMovieCards(
      senseResultsList,
      state.senseResults,
      "No world random pick matched those filters.",
    );
    showMessage(data.movie ? "World random pick ready." : "No random pick found.");
    if (data.movie) showToast("Random pick ready", data.movie.title);
    saveSearch(filterSummary(filters), {
      filters,
      type: "random",
      where: "Random Picker",
    });
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading("cinesense", false);
  }
}

async function toggleWatchlist(movieId, isInWatchlist) {
  try {
    setLoading(`watchlist-${movieId}`, true, isInWatchlist ? "Removing from watchlist..." : "Adding to watchlist...");
    const userId = getId(state.user);

    if (isInWatchlist) {
      await window.cineWatchApi.removeFromWatchlist(userId, movieId);
      showMessage("Removed from watchlist.");
      showToast("Watchlist updated", "Movie removed from your list.");
    } else {
      await window.cineWatchApi.addToWatchlist(userId, movieId);
      showMessage("Added to watchlist.");
      showToast("Added to watchlist", "Saved for later.");
    }

    await Promise.all([
      refreshUserData(),
      loadMovies(searchInput.value.trim()),
      loadRecommendations(),
    ]);
    renderHero();
    renderHeroPosters();
    renderMovies();
    renderWatchlist();
    renderRecommendations();
    renderTasteOrbit(state.tasteMode);
    renderCineverseBackdrop();
    renderDashboard();
    if (state.activeDetailMovieId === movieId && document.querySelector("#details-view").classList.contains("active")) {
      await openMovieDetails(movieId);
    }
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading(`watchlist-${movieId}`, false);
  }
}

async function saveRating(movieId, score, review = "") {
  try {
    setLoading(`rating-${movieId}`, true, "Saving rating and review...");
    await window.cineWatchApi.rateMovie(getId(state.user), movieId, score, review);
    showMessage(`Rated ${score}/10.`);
    showToast("Rating saved", review ? "Your rating and review were saved." : `Rated ${score}/10.`);
    await Promise.all([
      refreshUserData(),
      loadMovies(searchInput.value.trim()),
      loadRecommendations(),
    ]);
    renderHero();
    renderHeroPosters();
    renderMovies();
    renderWatchlist();
    renderRecommendations();
    renderTasteOrbit(state.tasteMode);
    renderCineverseBackdrop();
    renderDashboard();
    if (state.activeDetailMovieId === movieId && document.querySelector("#details-view").classList.contains("active")) {
      await openMovieDetails(movieId);
    }
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading(`rating-${movieId}`, false);
  }
}

async function showSimilarMovies(movieId, title) {
  try {
    const data = await window.cineWatchApi.getSimilarMovies(movieId);
    state.similarMovies = data.movies;
    renderSimilarMovies();
    showMessage(`Showing movies similar to ${title}.`);
    showToast("Similar movies ready", title);
  } catch (error) {
    showApiError(error);
  }
}

function trailerEmbedUrl(trailerUrl) {
  if (!trailerUrl) return "";

  try {
    const url = new URL(trailerUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const key = url.pathname.split("/").filter(Boolean)[0];
      return key ? `https://www.youtube.com/embed/${key}` : "";
    }

    if (host.endsWith("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) return trailerUrl;

      const key = url.searchParams.get("v");
      return key ? `https://www.youtube.com/embed/${key}` : "";
    }
  } catch {
    return "";
  }

  return "";
}

function renderTrailerFrame(targetElement, trailerUrl, movieTitle) {
  const embedUrl = trailerEmbedUrl(trailerUrl);
  targetElement.hidden = false;
  targetElement.innerHTML = "";

  const heading = document.createElement("div");
  heading.className = "trailer-heading";

  const title = document.createElement("strong");
  title.textContent = "Trailer";

  const externalLink = document.createElement("a");
  externalLink.href = trailerUrl;
  externalLink.target = "_blank";
  externalLink.rel = "noopener noreferrer";
  externalLink.textContent = "Open on YouTube";

  heading.append(title, externalLink);

  if (!embedUrl) {
    const fallback = document.createElement("p");
    fallback.className = "empty-state";
    fallback.textContent = "Trailer found, but it cannot be embedded here. Open it on YouTube.";
    targetElement.append(heading, fallback);
    targetElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  const frame = document.createElement("iframe");
  frame.className = "trailer-frame";
  frame.src = embedUrl;
  frame.title = `${movieTitle} trailer`;
  frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.allowFullscreen = true;

  targetElement.append(heading, frame);
  targetElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function openMovieTrailer(movieId, knownTrailerUrl = "", targetElement = null, movieTitle = "Movie") {
  try {
    setLoading(`trailer-${movieId}`, true, "Finding trailer...");
    const trailerUrl = knownTrailerUrl || (await window.cineWatchApi.getMovieTrailer(movieId)).trailerUrl;

    if (!trailerUrl) {
      showToast("Trailer unavailable", "TMDB did not return a trailer for this movie.");
      showMessage("Trailer unavailable for this movie.");
      return;
    }

    if (targetElement) {
      renderTrailerFrame(targetElement, trailerUrl, movieTitle);
      showMessage("Trailer ready.");
      showToast("Trailer ready", "Playing inside CineWatch.");
      return;
    }

    window.open(trailerUrl, "_blank", "noopener,noreferrer");
    showMessage("Trailer opened.");
    showToast("Trailer opened", "YouTube trailer is opening.");
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading(`trailer-${movieId}`, false);
  }
}

async function openMovieDetails(movieId) {
  try {
    state.activeDetailMovieId = movieId;
    showMessage("Loading movie details...");
    const [movieData, similarData] = await Promise.all([
      window.cineWatchApi.getMovie(movieId),
      window.cineWatchApi.getSimilarMovies(movieId),
    ]);

    renderDetailsPage(movieData.movie, similarData.movies);
    switchView("details");
    showMessage("Ready.");
  } catch (error) {
    showApiError(error);
  }
}

async function importTmdbMovie(tmdbId) {
  try {
    setLoading(`import-${tmdbId}`, true, "Importing movie...");
    const data = await window.cineWatchApi.importTmdbMovie(tmdbId);
    state.tmdbResults = state.tmdbResults.filter((movie) => String(movie.tmdbId) !== String(tmdbId));
    state.senseResults = state.senseResults.map((movie) => (
      String(movie.tmdbId) === String(tmdbId) ? data.movie : movie
    ));
    renderTmdbResults();
    renderMovieCards(
      senseResultsList,
      state.senseResults,
      "No movies match those filters yet.",
    );
    showMessage("Imported movie into CineWatch.");
    showToast("Import complete", `${data.movie.title} is now in your library.`);
    await renderApp(searchInput.value.trim());
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading(`import-${tmdbId}`, false);
  }
}

async function requestImportMovie(movie) {
  const confirmed = await askChoice({
    title: `Import ${movie.title}?`,
    copy: `${movie.releaseYear ? `${movie.releaseYear} | ` : ""}${movie.genres?.slice(0, 3).join(", ") || "TMDB movie"} will be added to your CineWatch library.`,
    confirmText: "Import Movie",
    kicker: "Poster Universe",
  });

  if (confirmed) {
    await importTmdbMovie(movie.tmdbId);
  }
}

async function requestDeleteStoredMovie(movieId, title) {
  const shouldDelete = await askChoice({
    title: `Delete ${title}?`,
    copy: "This removes the movie from CineWatch, including its ratings and watchlist entries.",
    confirmText: "Delete Movie",
    kicker: "Careful",
    danger: true,
  });

  if (!shouldDelete) return;

  try {
    setLoading(`delete-${movieId}`, true, "Deleting movie...");
    await window.cineWatchApi.deleteMovie(movieId);
    state.activeDetailMovieId = null;
    detailsPageContent.innerHTML = "<p class=\"empty-state\">Movie deleted. Choose another movie to open details.</p>";
    await renderApp(searchInput.value.trim());
    switchView("browse");
    showMessage(`Deleted ${title}.`);
    showToast("Movie deleted", title, "danger");
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading(`delete-${movieId}`, false);
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
    showToast("Movie added", formData.get("title"));
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
    setLoading("tmdb-search", true, "Searching TMDB posters...");
    renderTmdbResults();
    const data = await window.cineWatchApi.searchTmdbMovies(query);
    state.tmdbResults = data.movies;
    saveSearch(query, {
      type: "tmdb",
      where: "Poster Universe",
    });
    renderTmdbResults();
    showMessage(`Found ${state.tmdbResults.length} TMDB results.`);
    showToast("Poster search ready", `${state.tmdbResults.length} results found.`);
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading("tmdb-search", false);
    renderTmdbResults();
  }
});

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchInput.searchTimeout);
  searchInput.searchTimeout = window.setTimeout(() => {
    const query = searchInput.value.trim();
    saveSearch(query, {
      type: "library",
      where: "Library Search",
    });
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

    if (document.querySelector("#details-view").classList.contains("active")) {
      closeDetailsPage();
    }
  }
});
document.addEventListener("pointermove", (event) => {
  updateCineversePointer(event);
  handleCardTilt(event);
});
document.addEventListener("pointerout", clearCardTilt);

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
cinebotForm.addEventListener("submit", runCineBot);
quizForm.addEventListener("submit", runMoodQuiz);
tasteModeButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-taste-mode]");

  if (!button) return;

  renderTasteOrbit(button.dataset.tasteMode);
});
industryButtons.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-industry]");

  if (!button) return;

  await runIndustryLens(button.dataset.industry);
});

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(historyKey);
  renderSearchHistory();
  showMessage("Search history cleared.");
});

authOpen.addEventListener("click", () => {
  setAuthMode(authMode);
  authDialog.showModal();
});

authClose.addEventListener("click", () => authDialog.close());

authLoginTab.addEventListener("click", () => setAuthMode("login"));
authRegisterTab.addEventListener("click", () => setAuthMode("register"));

choiceCancel.addEventListener("click", () => resolveChoice(false));
choiceConfirm.addEventListener("click", () => resolveChoice(true));
choiceDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  resolveChoice(false);
});

demoUserButton.addEventListener("click", async () => {
  try {
    setLoading("auth", true, "Loading demo profile...");
    await useDemoUser({ persist: true });
    authDialog.close();
    await renderApp(searchInput.value.trim());
    showMessage("Demo profile loaded.");
    showToast("Demo profile loaded", "You are using the shared demo account.");
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading("auth", false);
  }
});

authLogout.addEventListener("click", async () => {
  localStorage.removeItem(userKey);
  state.user = null;
  state.ratingsByMovieId = new Map();
  state.watchlistByMovieId = new Map();
  authDialog.close();
  await useDemoUser({ persist: true });
  await renderApp(searchInput.value.trim());
  showMessage("Logged out. Demo profile loaded.");
  showToast("Logged out", "Demo profile loaded.");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    setLoading("auth", true, authMode === "register" ? "Creating account..." : "Signing in...");
    const data = authMode === "register"
      ? await window.cineWatchApi.registerUser(authName.value.trim(), authEmail.value.trim(), authPassword.value)
      : await window.cineWatchApi.loginUser(authEmail.value.trim(), authPassword.value);

    setActiveUser(data.user, { persist: true });
    authForm.reset();
    authDialog.close();
    await renderApp(searchInput.value.trim());
    showMessage(`Signed in as ${data.user.name}.`);
    showToast("Signed in", data.user.name);
  } catch (error) {
    showApiError(error);
  } finally {
    setLoading("auth", false);
  }
});

modalClose.addEventListener("click", () => movieModal.close());

movieModal.addEventListener("click", (event) => {
  if (event.target === movieModal) {
    movieModal.close();
  }
});

renderApp();
