// Like in the index.js page we are importing the express library as a var called express
const express = require("express");
let router = express.Router(); // This is a route, we are simply just using a let var and exporting it so we can split up our code and makeing it easier to read
// This is the node js lirary I've chosen to go with to query my SQL server
const { Pool, Client } = require("pg");
require("dotenv").config({ path: "../../../.env" }); // dot env

// authentication middleware
const auth = require("../../../auth/middleWareAuth");

// Here we can accept json as a valid body object
router.use(express.json());

// This is the connection string to my Database, I am using this with the PG node js library so
// I can query the database. Also, the database is a MySQL Postgre server
const connectionString = process.env.CONNECTIONSTRING;

router.put("/:username", auth.authenticateToken, (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.json({ result: "Body is Empty" });
    }
  } catch (ex) {
    res.json(ex);
  }

  const amount = req.body.amount;
  const userName = req.params.username;

  const client = new Client({
    connectionString,
  });

  // Checking if another user with the same username exists
  const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  const existsValues = [userName];

  client.connect();
  client.query(existsQuery, existsValues, (err, sqlRes) => {
    // err, set status and send
    if (err) {
      res.status(500).json({ result: "Internal Server Error" });
    } else if (sqlRes.rows[0].exists === true) {
      const query =
        "UPDATE users SET checkings = checkings + $1 WHERE username=$2";
      const values = [amount, userName];

      client.query(query, values, (err, sqlRes) => {
        if (err) {
          res.status(500).json({ result: "Internal Server Error" });
        } else {
          res
            .status(200)
            .json({ result: `Succesfully added ${amount} to ${userName}` });
        }
      });
    } else {
      res.status(403).json({ result: "User does not exist." });
    }
  });
});

module.exports = router;
