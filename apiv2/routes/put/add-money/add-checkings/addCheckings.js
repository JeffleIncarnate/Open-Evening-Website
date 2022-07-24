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

// This is the endpoint for updating the user, it takes 1 parameter:
// @req.params.username, this will be the previous name of the user if they want to change their name
router.put("/:username", auth.authenticateToken, (req, res) => {
  // here we are simpley checking if the request body is null, or empty, is error, then we catch, and send it back
  try {
    if (Object.keys(req.body).length === 0) {
      res.json({ result: "Body is Empty" });
    }
  } catch (ex) {
    res.json(ex);
  }

  // This is the amuount we want to add to the checkings amount
  const amount = req.body.amount;
  // Username from the request uri
  const userName = req.params.username;

  // Create a constructer of Client from the p.g package
  const client = new Client({
    connectionString,
  });

  // Checking if another user with the same username exists
  const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  // Values to check if the user exists
  const existsValues = [userName];

  // Connect
  client.connect();

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
    // err, set status and send
    if (err) {
      res.status(500).json({ result: "Internal Server Error" });
    }
    // Since the sqlRes returns it under exists, we can just check that if the user exists
    else if (sqlRes.rows[0].exists === true) {
      // Query to add moeny to the checkings account
      const query =
        "UPDATE users SET checkings = checkings + $1 WHERE username=$2";
      // Values to add money to the checkings account
      const values = [amount, userName];

      // This is the query callback function, it takes 2 parameters: Query, and Values (Values need to be provided as an array)
      // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
      // client.query (query, values)...
      // A call back is a new form of ES6 Javascript syntax
      // Old syntax:
      // client.query('SELECT...' function(req, sqlRes) {...})
      // New syntax
      // client.query('SELECT...',  (req, sqlRes) => {})
      // Here we only check for an error, since it will return nothing
      client.query(query, values, (err) => {
        // If error, we just send it back
        if (err) {
          res.status(500).json({ result: "Internal Server Error" });
        }
        // Else we just send success
        else {
          res
            .status(200) // status of 200 (success)
            .json({ result: `Succesfully added ${amount} to ${userName}` });
          client.end();
        }
      });
    } else {
      res.status(403).json({ result: "User does not exist." });
    }
  });
});

// Export the router so we can access it from the index.js file
module.exports = router;
