const mongoose = require("mongoose");
const Joi = require("joi");

// Define the schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

// Create the model
const Genre = mongoose.model("Genre", genreSchema);

// Validation function
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(genre);
}

module.exports = {
  Genre,
  validateGenre,
};
