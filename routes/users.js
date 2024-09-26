const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Users, validateUsers } = require("../models/users");
const bcrypt = require("bcrypt");
//Get All

router.get("/", async (req, res) => {
  const users = await Users.find().sort("name").select("name username _id");
  res.send(users);
});

//Get One
router.get("/:id", async (req, res) => {
  const param = req.params.id;
  //Validate the id format
  if (!mongoose.Types.ObjectId.isValid(param)) {
    return res.status(400).send("invalid User ID format");
  }
  const user = await Users.findById(param).select("name username _id");

  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

//Create a new User
router.post("/", async (req, res) => {
  const { error } = validateUsers(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await Users.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User Already Registered");

  user = new Users({
    name: req.body.name,
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
  });
  user = await user.save();
  const { _id, username, name } = user;
  res.send({ _id, username, name });
});

//Update a user by ID
router.put("/:id", async (req, res) => {
  const { error } = validateUsers(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userId = req.params.id;
  const updateData = {
    name: req.body.name,
    username: req.body.username,
  };

  // If the password is being updated, hash it
  if (req.body.password) {
    updateData.password = await bcrypt.hash(req.body.password, 10);
  }

  const user = await Users.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("username name _id");
  if (!user) return res.status(404).send("User does not exist");

  res.send(user);
});

//Delete a User by Id

router.delete("/:id", async (req, res) => {
  const param = req.params.id;
  const user = await Users.findByIdAndDelete(param);
  if (!user) {
    return res.status(404).send("User not Found");
  }
  res.send(user);
});

module.exports = router;
