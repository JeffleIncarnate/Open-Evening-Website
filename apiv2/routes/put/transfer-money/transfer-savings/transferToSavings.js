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

  // This is the amount taken from the request body
  const amount = req.body.amount;

  // Checking if the value is NaN (Not a Number) or less tham 0
  if (amount <= 0 || isNaN(amount)) {
    // then we know it's not money
    notMoney = true;
  }

  // Client Constructor
  const cleint = new Client({
    connectionString,
  });

  // Connect
  cleint.connect();

  // Getting the username from the request paramaters
  const userName = req.params.username;

  // Checking if we have enough money Query
  const enoughMoneyQuery = "SELECT checkings FROM users WHERE username=$1";
  // Checking if we have enough money Values
  const enoughMoneyValues = [userName];

  // This is the query callback function, it takes 2 parameters: Query, and Values (Values need to be provided as an array)
  // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
  // client.query (query, values)...
  // A call back is a new form of ES6 Javascript syntax
  // Old syntax:
  // client.query('SELECT...' function(req, sqlRes) {...})
  // New syntax
  // client.query('SELECT...',  (req, sqlRes) => {})
  // This is to check if the user has enough money
  cleint.query(
    enoughMoneyQuery,
    enoughMoneyValues,
    (existsErr, existsSqlRes) => {
      // If error, then send an error and change status
      if (existsErr) {
        res.status(500).json({ result: "Internal Server Error" });
      }
      // else we know they exist
      else {
        // This checking is the user has enough savings, since we are transferign from savings to checkings
        var amountInCheckings = existsSqlRes.rows[0].checkings;

        // If the amount they want to send is more than the total amount in savings, then we know the user is full of shit
        if (amount > amountInCheckings) {
          res.status(400).json({ result: "Insufficient funds" });
        }
        // else we know they have enough money to send
        else {
          // User exists Query
          const existsQuery =
            "SELECT EXISTS(SELECT * from users WHERE username=$1);";
          // User exists Values
          const existsValues = [userName];

          // This is the query callback function, it takes 2 parameters: Query, and Values (Values need to be provided as an array)
          // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
          // client.query (query, values)...
          // A call back is a new form of ES6 Javascript syntax
          // Old syntax:
          // client.query('SELECT...' function(req, sqlRes) {...})
          // New syntax
          // client.query('SELECT...',  (req, sqlRes) => {})
          // This is to check if the user exists
          cleint.query(existsQuery, existsValues, (err, sqlRes) => {
            // If error, then we change status code and throw and error
            if (err) {
              res.status(500).json({ result: "Internal Server Error" });
            }
            // else if they do exist, then we continue
            else if (sqlRes.rows[0].exists === true) {
              // If the notMoney var == false, then we add money to the savings account
              if (notMoney == false) {
                // add add money to savings, and remove from checkings Query
                const updateQuery =
                  "UPDATE users SET savings=savings+$1, checkings=checkings-$2 WHERE username=$3";
                // add add money to checkings, and remove from savings values
                const updateValues = [amount, amount, userName];

                // This is the query callback function, it takes 2 parameters: Query, and Values (Values need to be provided as an array)
                // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
                // client.query (query, values)...
                // A call back is a new form of ES6 Javascript syntax
                // Old syntax:
                // client.query('SELECT...' function(req, sqlRes) {...})
                // New syntax
                // client.query('SELECT...',  (req, sqlRes) => {})
                // This is update the user's savings, and checkings account
                cleint.query(updateQuery, updateValues, (error) => {
                  // If error, then we change status code and send back error to the user
                  if (error) {
                    res.status(500).json({ result: "Internal Server Error" });
                  }
                  // Else we know we succeded, and we set status code to 201, and send back a success message
                  else {
                    res.status(201).json({
                      result: `Successfully added ${amount} to '${userName}' savings.`,
                    });
                    // Terminate the connection
                    cleint.end();
                  }
                });
              } else {
                res
                  .status(500)
                  .json({ result: "Amount provided is null or nothing" });
              }
            } else {
              res
                .status(400)
                .json({ result: "User does not exist in the database" });
            }
          });
        }
      }
    }
  );
});

// Export Router to the user
module.exports = router;
