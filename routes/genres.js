const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genres"); // Ensure path is correct

// Get Collection Request
router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (err) {
    res.status(500).send("Error fetching genres.");
  }
});

// GET Singular Request
router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with this ID does not exist.");
    res.send(genre);
  } catch (err) {
    res.status(500).send("Error fetching genre.");
  }
});

// POST Request
router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  try {
    await genre.save();
    res.send(genre);
  } catch (err) {
    res.status(500).send("Error saving genre.");
  }
});

// PUT Request
router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!genre)
      return res.status(404).send("The genre with this ID does not exist.");
    res.send(genre);
  } catch (err) {
    res.status(500).send("Error updating genre.");
  }
});

// DELETE Request
router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with this ID does not exist.");
    res.send(genre);
  } catch (err) {
    res.status(500).send("Error deleting genre.");
  }
});

module.exports = router;
