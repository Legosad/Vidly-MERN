const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Movie, validate } = require("../models/movies.js");
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");

// Get all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

// Get a single movie by ID
router.get("/:id", async (req, res) => {
  const param = req.params.id;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(param)) {
    return res.status(400).send("Invalid movie ID format");
  }

  const movie = await Movie.findById(param);

  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

// Create a new movie
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let movie = new Movie({
    title: req.body.title,
    genre: req.body.genreId, // Using genreId instead of genre object
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    liked: req.body.liked,
  });

  movie = await movie.save();
  res.send(movie);
});

// Update a movie by ID
router.put("/:id", auth, admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movieId = req.params.id;

  const movie = await Movie.findByIdAndUpdate(
    movieId,
    {
      title: req.body.title,
      genre: req.body.genreId, // Using genreId instead of genre object
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      publishDate: req.body.publishDate,
      liked: req.body.liked,
    },
    { new: true }
  );

  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

// Delete a movie by ID
router.delete("/:id", auth, admin, async (req, res) => {
  const param = req.params.id;
  const movie = await Movie.findByIdAndDelete(param);
  if (!movie) {
    return res.status(404).send("Movie not found");
  }
  res.send(movie);
});

module.exports = router;
