// Like in the index.js page we are importing the express library as a var called express
const express = require("express");
let router = express.Router(); // This is a route, we are simply just using a let var and exporting it so we can split up our code and makeing it easier to read
// This is the node js lirary I've chosen to go with to query my SQL server
const { Pool, Client } = require("pg");
require("dotenv").config();

// Here we can accept json as a valid body object
router.use(express.json());

// These are the varaibles from the .env File and saving them as constants since they will never change
const name = process.env.NAME;
const password = process.env.PASSWORD;
// This is the connection string to my Database, I am using this with the PG node js library so
// I can query the database. Also, the database is a MySQL Postgre server
const connectionString = process.env.CONNECTIONSTRING;

router.put("/:username", (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.json({ result: "Body is Empty" });
    }
  } catch (ex) {
    res.json(ex);
  }

  // Here I am getting the name and password from auth json and I'm setting them to variables nameBody, and passwordBody
  // so it's easier to read the code
  const nameBody = req.body.name;
  const passwordBody = req.body.password;

  // Checking the name provided from the body and I'm checking it against the secret one
  if (nameBody === name) {
    // Here I am checking the password provided from the body and I'm checking it against the secret one
    if (passwordBody === password) {
      const transferFrom = req.params.username;
      const transferTo = req.body.transferTo;
      const amount = req.body.amount;
      var userExists = false;

      if (transferTo === "" || transferTo === null) {
        res
          .status(500)
          .json({ result: "Please provide user to send money to." });
      }

      // Cheking if the user to exists
      const existsQuery =
        "SELECT EXISTS(SELECT * from users WHERE username=$1);";
      const existsValues = [transferTo];

      const client = new Client({
        connectionString,
      });

      client.connect();
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
                      res.status(500).json({ result: "Unknown Server Error" });
                    } else {
                      res.status(201).json({
                        result: `Succesfully added ${amount} to '${transferTo}' sent from ${transferFrom}`,
                      });
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
    } else {
      res.json({ result: "Wrong password." });
    }
  } else {
    res.json({ result: "Wrong username." });
  }
});

module.exports = router;
