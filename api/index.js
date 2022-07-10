// Express
const express = require("express");
// PG (Postgre SQL library)
const { Pool, Client } = require("pg");
require("dotenv").config();

// Connection String read with dotenc
const connectionString = process.env.CONNECTIONSTRING;

const pool = new Pool({
  connectionString,
});

pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  pool.end();
});

// App constructor
const app = express();
const port = 3000;

// First basic endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Listening on: localhost:3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
