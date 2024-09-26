const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre", // Reference to Genre model
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
  },
  liked: {
    type: Boolean,
    default: false,
  },
});

// Create the Movie model
const Movie = mongoose.model("Movie", movieSchema);

// Validate movie data
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    genreId: Joi.string().required(), // Genre ID as a string
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    liked: Joi.boolean(),
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
