const express = require("express");
let router = express.Router();
const { Pool, Client } = require("pg");
require("dotenv").config();

const connectionString = process.env.CONNECTIONSTRING;

router.get("/", (req, res) => {
  res.send("Will work on later.");
});

module.exports = router;
