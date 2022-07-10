// Express
const express = require("express");
// Router file paths
const userInDatabase = require("./routes/userInDatabase");
const getAllUsers = require("./routes/getAllUsers");
// Postgre
const { Pool, Client } = require("pg");
require("dotenv").config();

// App constructor
const app = express();
const port = 3000;

// Routes uses
app.use("/userInDatabase", userInDatabase);
app.use("/GetAllUsers", getAllUsers);

// First basic endpoint
app.get("/", (req, res) => {
  res.send("Please pick a real endpoint");
});

// Listening on: localhost:3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
