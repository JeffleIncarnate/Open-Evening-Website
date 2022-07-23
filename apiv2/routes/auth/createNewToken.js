// Importing Express
const express = require("express");
// Express Router
let router = express.Router();
// The JWT library we need
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "relative/path/to/your/.env" });

const usernameBody = process.env.NAME;
const passwordBody = process.env.PASSWORD;

// Importing json so we can take json in the request body
router.use(express.json());

// The endpoint to the token generater
router.post("", (req, res) => {
  if (req.body.username != usernameBody) {
    res.status(403).json({ result: "Username invalid" });
  }
  if (req.body.password != passwordBody) {
    res.status(403).json({ result: "Password invalid" });
  }

  // Getting the username, and then storing it in the user object
  const username = req.body.username;
  const user = { name: username };

  // Here we are signing the token that we create to the var "accessToken"
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken }); // Return the "accessToken" to the user, so they can call the API
});

module.exports = router;
