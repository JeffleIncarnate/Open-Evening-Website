const express = require("express");
let router = express.Router();
const { Pool, Client } = require("pg");
require("dotenv").config();

const connectionString = process.env.CONNECTIONSTRING;

router.get("/:username", (req, res) => {
  let userInDataBase = false;
  const query = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  const userName = req.params.username;
  const values = [userName];

  const client = new Client({
    connectionString,
  });

  client.connect();
  client.query(query, values, (err, sqlRes) => {
    if (err) {
      res.send(err.stack)
    } else {
      res.send(sqlRes.rows[0].exists);
      userInDataBase = true;
    }
  });
});

module.exports = router;
