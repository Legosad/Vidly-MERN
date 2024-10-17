const mongoose = require("mongoose");
const genres = require("./routes/genres");
const movies = require("./routes/movies-api"); // Add movies route
const users = require("./routes/users");
const auth = require("./routes/auth");
const cors = require("cors");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/Vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use(cors());
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/users", users); // Add users route
app.use("/api/auth", auth); // Add auth route

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));
