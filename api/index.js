// Express
const express = require("express");
// CORS
const cors = require("cors");
// Router file paths
const userInDatabase = require("./routes/userInDatabase");
const getAllUsers = require("./routes/getAllUsers");
const getUserData = require("./routes/getUserData");
const signUpUser = require("./routes/signUpUser");
const updateUser = require("./routes/updateUser");
const deleteUser = require("./routes/deleteUser");

// Postgre
const { Pool, Client } = require("pg");
require("dotenv").config();

// App constructor
const app = express();
const port = 3000;

// CORS
app.use(cors());

// Routes uses
app.use("/userInDatabase", userInDatabase);
app.use("/getAllUsers", getAllUsers);
app.use("/getUserData", getUserData);
app.use("/signUpUser", signUpUser);
app.use("/updateUser", updateUser);
app.use("/deleteUser", deleteUser);

// First basic endpoint
app.get("/", (req, res) => {
  res.json({ result: "Please pick a real endpoint" });
});

// Listening on: localhost:3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
