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

  const transferFrom = req.params.username;
  const transferTo = req.body.transferTo;
  const amount = req.body.amount;

  if (transferTo === "" || transferTo === null) {
    res.status(500).json({ result: "Please provide user to send money to." });
  }

  // Cheking if the user to exists
  const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  const existsValues = [transferTo];

  const client = new Client({
    connectionString,
  });

  client.connect();

  const enoughMoneyQuery = "SELECT checkings FROM users WHERE username=$1";
  const enoughMoneyValues = [transferFrom];

  client.query(enoughMoneyQuery, enoughMoneyValues, (err, sqlRes) => {
    if (err) {
      res.status(500).json({ result: "Unknown Server Error" });
    } else {
      var amountInCheckings = sqlRes.rows[0].checkings;
      if (amount > amountInCheckings) {
        res.status(400).json({ result: "Insufficient funds" });
      } else {
        client.query(existsQuery, existsValues, (err, sqlRes) => {
          if (err) {
            res.status(500).json({ result: "Unknown Server Error" });
          } else if (sqlRes.rows[0].exists === true) {
            // Remove money from sent user
            const removeMoneyQuery =
              "UPDATE users SET checkings=checkings-$1 WHERE username=$2";
            const removeMoneyValues = [amount, transferFrom];

            client.query(
              removeMoneyQuery,
              removeMoneyValues,
              (error, sqlResponse) => {
                if (error) {
                  res.status(500).json({ result: "Unknown Server Error" });
                } else {
                  // Add money to user sent money.
                  const addMoneyQuery =
                    "UPDATE users SET checkings=checkings+$1 WHERE username=$2";
                  const addMoneyValues = [amount, transferTo];

                  client.query(
                    addMoneyQuery,
                    addMoneyValues,
                    (errorTo, sqlResponseTo) => {
                      if (errorTo) {
                        res
                          .status(500)
                          .json({ result: "Unknown Server Error" });
                      } else {
                        res.status(201).json({
                          result: `Succesfully added ${amount} to '${transferTo}' sent from ${transferFrom}`,
                        });
                        client.end();
                      }
                    }
                  );
                }
              }
            );
          } else {
            res.status(400).json({ result: "User does not exist." });
          }
        });
      }
    }
  });
});

module.exports = router;
