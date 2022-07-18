const express = require("express");
let router = express.Router();
const { Pool, Client } = require("pg");
require("dotenv").config();
const bcrypt = require("bcrypt");

const connectionString = process.env.CONNECTIONSTRING;

router.use(express.json());

router.get("/users", (req, res) => {
  const client = new Client({
    connectionString,
  });

  client.connect();
  client.query('SELECT * FROM "public"."coolkids"', (err, sqlRes) => {
    res.send(sqlRes.rows);
    client.end();
  });
});

router.post("/users", async (req, res) => {
  try {
    // Hashing Password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };

    const query = "INSERT INTO coolkids VALUES ($1, $2)";
    const values = [user.name, hashedPassword];
  } catch {
    res.status(500).send();
  }
});

router.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name == req.body.name);
  if (user == null) {
    return res.status(400).send("Can not find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not allowed");
    }
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
