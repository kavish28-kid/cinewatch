# CineWatch

CineWatch is a full-stack movie discovery web app built with HTML, CSS, JavaScript, Node.js, Express, MongoDB Atlas, and TMDB.

Live app: https://cinewatch-fk6d.onrender.com/

## Features

- Browse saved movies with posters, ratings, stats, and details
- Search TMDB for real-world movie posters and metadata
- Import TMDB movies into MongoDB
- Add and remove movies from a personal watchlist
- Rate movies from 1 to 10 and save short reviews
- Use CineSense for world-ranked recommendations by category, mood, rating, and count
- Pick a random top-rated world movie when users cannot decide
- View a dashboard with watchlist, ratings, favorite genre, and next-pick insights
- Use login/signup so each user has their own profile data
- View a full movie detail page with cast, director, overview, review box, and similar movies
- Track browser search history

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB Atlas with Mongoose
- Movie data: TMDB API
- Deployment: Render

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

Start the server:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Run tests:

```bash
npm test
```

Seed sample movie data:

```bash
npm run seed
```

## Project Structure

- `server.js` starts Express and connects to MongoDB.
- `src/app.js` configures middleware, static frontend hosting, API routes, and health checks.
- `src/models` contains `User`, `Movie`, `Watchlist`, and `Rating`.
- `src/controllers` contains route logic.
- `src/routes` contains API route definitions.
- `src/services/tmdbService.js` handles TMDB search, import, and world recommendations.
- `public` contains the browser frontend.

## API Routes

Users:

- `GET /api/users`
- `POST /api/users`
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/demo`
- `GET /api/users/:userId`

Movies:

- `GET /api/movies`
- `GET /api/movies?search=inception`
- `GET /api/movies/world?genre=Sci-Fi&minImdbRating=8&limit=6`
- `GET /api/movies/world/random?genre=Drama&minImdbRating=8`
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

Ratings and reviews:

- `GET /api/ratings?userId=:userId`
- `POST /api/ratings`
- `DELETE /api/ratings/:ratingId`

## Example Payloads

Register:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "secret123"
}
```

Login:

```json
{
  "email": "ada@example.com",
  "password": "secret123"
}
```

Add to watchlist:

```json
{
  "userId": "6630f0e17d95a84a6f66f111",
  "movieId": "6630f1657d95a84a6f66f222",
  "status": "planned"
}
```

Add rating and review:

```json
{
  "userId": "6630f0e17d95a84a6f66f111",
  "movieId": "6630f1657d95a84a6f66f222",
  "score": 9,
  "review": "Strong rewatch value"
}
```

## CineSense

CineSense recommends from TMDB world-ranked movies, not only the movies already saved in MongoDB. Users can filter by:

- category or genre
- mood
- minimum rating
- number of recommendations
- free-text prompt

World recommendations appear with posters, metadata, and a recommendation reason. A result can be imported into MongoDB, then rated or added to the user's watchlist.

## Deploy Online

Render settings:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Required Render environment variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
TMDB_API_KEY=your_tmdb_v3_api_key
TMDB_ACCESS_TOKEN=optional_tmdb_v4_read_access_token
CORS_ORIGIN=https://your-render-app.onrender.com
NODE_ENV=production
```

Do not upload your local `.env` file to GitHub.

Health check:

```text
https://your-render-app.onrender.com/health
```

Expected when Atlas connects:

```json
{"database":"connected","status":"ok"}
```
