"use strict";

require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const { connectDatabase } = require("../src/config/db");
const Movie = require("../src/models/Movie");

const movies = [
  {
    title: "Inception",
    overview: "A thief enters dreams to steal secrets and plant ideas.",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    releaseYear: 2010,
    runtimeMinutes: 148,
    spokenLanguage: "English",
    imdbRating: 8.8,
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
    genres: ["Sci-Fi", "Thriller"],
    moodTags: ["mind-bending", "intense", "clever"],
    source: "manual",
  },
  {
    title: "Interstellar",
    overview: "Explorers travel through a wormhole to save humanity.",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    releaseYear: 2014,
    runtimeMinutes: 169,
    spokenLanguage: "English",
    imdbRating: 8.7,
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    genres: ["Sci-Fi", "Drama"],
    moodTags: ["emotional", "epic", "thoughtful"],
    source: "manual",
  },
  {
    title: "The Dark Knight",
    overview: "Batman faces the Joker in Gotham City.",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    releaseYear: 2008,
    runtimeMinutes: 152,
    spokenLanguage: "English",
    imdbRating: 9.0,
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
    genres: ["Action", "Crime", "Drama"],
    moodTags: ["dark", "intense", "iconic"],
    source: "manual",
  },
  {
    title: "Avengers: Endgame",
    overview: "Heroes reunite for one final fight to restore the universe.",
    director: "Anthony Russo, Joe Russo",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    releaseYear: 2019,
    runtimeMinutes: 181,
    spokenLanguage: "English",
    imdbRating: 8.4,
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
    genres: ["Action", "Sci-Fi", "Adventure"],
    moodTags: ["epic", "heroic", "emotional"],
    source: "manual",
  },
  {
    title: "Guardians of the Galaxy",
    overview: "A group of unlikely heroes protect a powerful cosmic object.",
    director: "James Gunn",
    cast: ["Chris Pratt", "Zoe Saldana", "Dave Bautista"],
    releaseYear: 2014,
    runtimeMinutes: 121,
    spokenLanguage: "English",
    imdbRating: 8.0,
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/3/33/Guardians_of_the_Galaxy_%28film%29_poster.jpg",
    genres: ["Action", "Sci-Fi", "Comedy"],
    moodTags: ["fun", "quirky", "adventurous"],
    source: "manual",
  },
  {
    title: "La La Land",
    overview: "A musician and an actress chase dreams and love in Los Angeles.",
    director: "Damien Chazelle",
    cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
    releaseYear: 2016,
    runtimeMinutes: 128,
    spokenLanguage: "English",
    imdbRating: 8.0,
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png",
    genres: ["Romance", "Drama", "Music"],
    moodTags: ["romantic", "bittersweet", "dreamy"],
    source: "manual",
  },
  {
    title: "Dangal",
    overview: "A father trains his daughters to become world-class wrestlers.",
    director: "Nitesh Tiwari",
    cast: ["Aamir Khan", "Fatima Sana Shaikh", "Sanya Malhotra"],
    releaseYear: 2016,
    runtimeMinutes: 161,
    spokenLanguage: "Hindi",
    imdbRating: 8.3,
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg",
    genres: ["Drama", "Sports"],
    moodTags: ["inspiring", "emotional", "family"],
    source: "manual",
  },
  {
    title: "3 Idiots",
    overview: "Three engineering students challenge pressure and expectations.",
    director: "Rajkumar Hirani",
    cast: ["Aamir Khan", "R. Madhavan", "Sharman Joshi"],
    releaseYear: 2009,
    runtimeMinutes: 170,
    spokenLanguage: "Hindi",
    imdbRating: 8.4,
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
    genres: ["Comedy", "Drama"],
    moodTags: ["fun", "inspiring", "college"],
    source: "manual",
  },
];

async function seedMovies() {
  await connectDatabase();

  for (const movie of movies) {
    await Movie.findOneAndUpdate(
      { title: movie.title },
      { $set: movie, $unset: { language: "" } },
      { returnDocument: "after", setDefaultsOnInsert: true, upsert: true },
    );
  }

  console.log(`Seeded ${movies.length} movies.`);
  await mongoose.disconnect();
}

seedMovies().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
