const express = require("express");
let router = express.Router();
const { Pool, Client } = require("pg");
require("dotenv").config();

const connectionString = process.env.CONNECTIONSTRING;

router.get("/", (req, res) => {
  const client = new Client({
    connectionString,
  });

  client.connect();
  client.query('SELECT * FROM "public"."users"', (err, sqlRes) => {
    res.json(sqlRes.rows);
    client.end();
  });
});

module.exports = router;
