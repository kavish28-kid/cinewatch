# Cine Watch

Full-stack movie watchlist app using HTML, CSS, JavaScript, Node.js, Express, and MongoDB Atlas.

## Setup

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/watchlist_app
PORT=3000
CORS_ORIGIN=http://localhost:3000
TMDB_API_KEY=your_tmdb_v3_api_key
```

If Atlas fails with `querySrv ECONNREFUSED`, your network/DNS is blocking SRV lookup. Use the direct Atlas URI format from `.env.example` instead of `mongodb+srv://`.

Start the server:

```bash
npm start
```

Run tests:

```bash
npm test
```

Seed sample movie data:

```bash
npm run seed
```

## Structure

- `server.js` starts the app and connects to MongoDB.
- `src/app.js` configures Express, routes, static frontend, CORS, and error handling.
- `src/models` contains `User`, `Movie`, `Watchlist`, and `Rating`.
- `src/controllers` contains route logic.
- `src/routes` contains API route definitions.
- `src/middleware` contains CORS and error handling.
- `public` contains the browser frontend and fetch helpers.

## API Routes

Users:

- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:userId`

Movies:

- `GET /api/movies`
- `GET /api/movies?search=inception`
- `GET /api/movies/discover?genre=Sci-Fi&minImdbRating=8&limit=5&mood=any`
- `GET /api/movies/random?genre=Drama&minImdbRating=8`
- `GET /api/movies/tmdb/search?query=inception`
- `POST /api/movies/tmdb/:tmdbId/import`
- `POST /api/movies`
- `GET /api/movies/:movieId`
- `GET /api/movies/:movieId/similar`
- `GET /api/movies/:movieId/stats`

Watchlist:

- `GET /api/watchlist?userId=:userId`
- `POST /api/watchlist`
- `PATCH /api/watchlist/:watchlistId`
- `DELETE /api/watchlist/:watchlistId`
- `DELETE /api/watchlist/users/:userId/movies/:movieId`

Ratings:

- `GET /api/ratings?userId=:userId`
- `POST /api/ratings`
- `DELETE /api/ratings/:ratingId`

## Example Payloads

Create a user:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "passwordHash": "hashed-password"
}
```

Create a movie:

```json
{
  "title": "Inception",
  "overview": "A thief enters dreams to steal secrets.",
  "releaseYear": 2010,
  "genres": ["Sci-Fi", "Thriller"],
  "posterUrl": "https://example.com/inception.jpg"
}
```

Add a movie to watchlist:

```json
{
  "userId": "6630f0e17d95a84a6f66f111",
  "movieId": "6630f1657d95a84a6f66f222",
  "status": "planned",
  "notes": "Watch this weekend"
}
```

Add or update a rating:

```json
{
  "userId": "6630f0e17d95a84a6f66f111",
  "movieId": "6630f1657d95a84a6f66f222",
  "score": 9,
  "review": "Strong rewatch value"
}
```

## Frontend

The frontend is served from `public/` when the server runs.

Open:

```text
http://localhost:3000
```

Fetch helper functions are available in `public/js/api.js` as `window.cineWatchApi`.

## CineSense

CineSense is the recommendation section inside CineWatch. It can recommend movies by category, mood, minimum IMDb-style rating, and result count. It also includes a random movie picker for users who do not know what to watch, plus browser search history.

## TMDB Import

Add `TMDB_API_KEY` or `TMDB_ACCESS_TOKEN` to `.env` to search real movies from TMDB. The browser can preview TMDB search results and import a selected movie into MongoDB, including poster, overview, cast, director, runtime, genres, and rating.

## Deploy Online

The simplest deployment for this project is a single Node web service because Express serves both:

- the backend API from `src/`
- the frontend from `public/`

### Render

1. Push this project to GitHub.
2. In Render, create a new Web Service from the GitHub repo.
3. Use these settings:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
```

The included `render.yaml` can also be used as a Render Blueprint.

Set these environment variables in Render:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
TMDB_API_KEY=your_tmdb_v3_api_key
TMDB_ACCESS_TOKEN=optional_tmdb_v4_read_access_token
CORS_ORIGIN=https://your-render-app.onrender.com
NODE_ENV=production
```

Do not upload your local `.env` file to GitHub.

### MongoDB Atlas Network Access

For a quick college/demo deployment, allow access from `0.0.0.0/0` in MongoDB Atlas Network Access. For a stricter production setup, restrict Atlas access to your hosting provider's outbound IP strategy.

After deployment, open the Render URL and test:

```text
https://your-render-app.onrender.com/health
```

Expected when Atlas connects:

```json
{"database":"connected","status":"ok"}
```
