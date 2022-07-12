const express = require("express");
let router = express.Router();
const { Pool, Client } = require("pg");
require("dotenv").config();

const connectionString = process.env.CONNECTIONSTRING;

router.get("/:username/:firstname/:lastname/:accountbalance", (req, res) => {
  const { username, firstname, lastname, accountbalance } = req.params;
  const query =
    "INSERT INTO users (username, firstname, lastname, accountbalance) VALUES ($1, $2, $3, $4)";
  const values = [username, firstname, lastname, accountbalance];

  const client = new Client({
    connectionString,
  });

  client.connect();
  client.query(query, values, (err, sqlRes) => {
    if (err) {
      res.send(err.stack);
    } else {
      res.send(sqlRes.rows);
    }
  });
});

module.exports = router;
