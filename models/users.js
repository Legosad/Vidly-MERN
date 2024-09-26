const mongoose = require("mongoose");
const Joi = require("joi");

// Define the schema
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

const Users = mongoose.model("Users", usersSchema);

function validateUsers(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    username: Joi.string().email().min(8).max(50).required(),
    password: Joi.string().min(8).max(50).required(),
  });
  return schema.validate(user);
}

module.exports = {
  Users,
  validateUsers,
};
