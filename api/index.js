// Express
const express = require("express");
const userInDatabase = require("./routes/userInDatabase");
// PG (Postgre SQL library)
const { Pool, Client } = require("pg");
require("dotenv").config();

// Connection String read with dotenc
const connectionString = process.env.CONNECTIONSTRING;

const client = new Client({
  connectionString,
});
client.connect();
client.query('SELECT * FROM "public"."persons"', (err, res) => {
  console.log(err, res.rows);
  client.end();
});

// App constructor
const app = express();
const port = 3000;

app.use("/userInDatabase", userInDatabase);

// First basic endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Listening on: localhost:3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
