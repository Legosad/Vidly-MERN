const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/users");
const router = express.Router();
const Joi = require("joi");

// Login validation schema
function validateLogin(req) {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(req);
}
// Login route
router.post("/", async (req, res) => {
  // Validate the login request
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, password } = req.body;
  console.log(username, password);
  // Find user by username
  let user = await Users.findOne({ username }).select("name username password");
  if (!user) return res.status(400).send("Invalid username or password");

  // Check if the password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password");

  // Generate JWT
  const token = jwt.sign({ _id: user._id, name: user.name }, "jwtPrivateKey");

  res.send({ token });
});

module.exports = router;
