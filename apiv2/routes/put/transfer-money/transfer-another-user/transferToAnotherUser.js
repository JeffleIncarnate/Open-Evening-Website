// Like in the index.js page we are importing the express library as a var called express
const express = require("express");
let router = express.Router(); // This is a route, we are simply just using a let var and exporting it so we can split up our code and makeing it easier to read
// This is the node js lirary I've chosen to go with to query my SQL server
const { Client } = require("pg");
require("dotenv").config({ path: "../../../.env" }); // dot env

// authentication middleware
const auth = require("../../../auth/middleWareAuth");

// Here we can accept json as a valid body object
router.use(express.json());

// This is the connection string to my Database, I am using this with the PG node js library so
// I can query the database. Also, the database is a MySQL Postgre server
const connectionString = process.env.CONNECTIONSTRING;

// This is the router to send money to another user (in the database)
// @req.params.username, Transfer From, who is sending the money
router.put("/:username", auth.authenticateToken, (req, res) => {
  // Checking if the body is empty, or null
  try {
    if (Object.keys(req.body).length === 0) {
      res.json({ result: "Body is Empty" });
    }
  } catch (ex) {
    res.json(ex);
  }

  // Transfer from is in the parameters
  const transferFrom = req.params.username;
  const transferTo = req.body.transferTo;
  const amount = req.body.amount;

  if (transferTo === "" || transferTo === null) {
    res.status(500).json({ result: "Please provide user to send money to." });
  }

  // Cheking if the user to exists
  const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  const existsValues = [transferTo];

  // Client Constructor
  const client = new Client({
    connectionString,
  });

  // Connect
  client.connect();

  // Checking if the user has enough money Query
  const enoughMoneyQuery = "SELECT checkings FROM users WHERE username=$1";
  // Checking if the user has enough money Values
  const enoughMoneyValues = [transferFrom];

  // This is the query callback function, it takes 2 parameters: Query, and Values (Values need to be provided as an array)
  // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
  // client.query (query, values)...
  // A call back is a new form of ES6 Javascript syntax
  // Old syntax:
  // client.query('SELECT...' function(req, sqlRes) {...})
  // New syntax
  // client.query('SELECT...',  (req, sqlRes) => {})
  // This is to check if the user has enough money
  client.query(enoughMoneyQuery, enoughMoneyValues, (err, sqlRes) => {
    // If error, then we set status 500, and send back error
    if (err) {
      res.status(500).json({ result: "Unknown Server Error" });
    }
    // Ekse we check if the user had enough money to send
    else {
      // Variable to the total amount in checkings
      var amountInCheckings = sqlRes.rows[0].checkings;

      // If the user does not have enough money, then we set status 400, and send back an error
      if (amount > amountInCheckings) {
        res.status(400).json({ result: "Insufficient funds" });
      }
      // else we know we have enough money, then we check if the user even exists.
      else {
        // This is the query callback function, it takes 2 parameters: Query, and Values (Values need to be provided as an array)
        // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
        // client.query (query, values)...
        // A call back is a new form of ES6 Javascript syntax
        // Old syntax:
        // client.query('SELECT...' function(req, sqlRes) {...})
        // New syntax
        // client.query('SELECT...',  (req, sqlRes) => {})
        // This is to check if the user exists.
        client.query(existsQuery, existsValues, (err, sqlRes) => {
          // If err, then we set status 500 and send back an error
          if (err) {
            res.status(500).json({ result: "Unknown Server Error" });
          }
          // if the user does exist, then we can remove money from the user who sent the money
          else if (sqlRes.rows[0].exists === true) {
            // Remove money from sent user Query
            const removeMoneyQuery =
              "UPDATE users SET checkings=checkings-$1 WHERE username=$2";
            // Remove money from sent user Values
            const removeMoneyValues = [amount, transferFrom];

            // This is the query callback function, it takes 2 parameters: Query, and Values (Values need to be provided as an array)
            // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
            // client.query (query, values)...
            // A call back is a new form of ES6 Javascript syntax
            // Old syntax:
            // client.query('SELECT...' function(req, sqlRes) {...})
            // New syntax
            // client.query('SELECT...',  (req, sqlRes) => {})
            // This is to remove the money from the user who sent the money
            client.query(removeMoneyQuery, removeMoneyValues, (error) => {
              // If error, then we send an error
              if (error) {
                res.status(500).json({ result: "Unknown Server Error" });
              }
              // else, we know to continue and add money to the sent money user
              else {
                // Add money to user sent money Query
                const addMoneyQuery =
                  "UPDATE users SET checkings=checkings+$1 WHERE username=$2";
                // Add money to user sent money Vaues
                const addMoneyValues = [amount, transferTo];

                // This is the query callback function, it takes 2 parameters: Query, and Values (Values need to be provided as an array)
                // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
                // client.query (query, values)...
                // A call back is a new form of ES6 Javascript syntax
                // Old syntax:
                // client.query('SELECT...' function(req, sqlRes) {...})
                // New syntax
                // client.query('SELECT...',  (req, sqlRes) => {})
                // This is to add the money from the user who is recieving the money
                client.query(addMoneyQuery, addMoneyValues, (errorTo) => {
                  // If error, then we send an error, and check the status
                  if (errorTo) {
                    res.status(500).json({ result: "Unknown Server Error" });
                  }
                  // else we know we succesfully completed the task, then we can end the client's connection
                  else {
                    res.status(201).json({
                      result: `Succesfully added ${amount} to '${transferTo}' sent from ${transferFrom}`,
                    });
                    client.end();
                  }
                });
              }
            });
          } else {
            res.status(400).json({ result: "User does not exist." });
          }
        });
      }
    }
  });
});

// Export router to be used in index.js
module.exports = router;
