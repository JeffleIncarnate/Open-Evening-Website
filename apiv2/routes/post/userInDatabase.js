// Like in the index.js page we are importing the express library as a var called express
const express = require("express");
let router = express.Router(); // This is a route, we are simply just using a let var and exporting it so we can split up our code and makeing it easier to read
// This is the node js lirary I've chosen to go with to query my SQL server
const { Client } = require("pg");
require("dotenv").config({ path: "../../.env" }); // dot env

// authentication middleware
const auth = require("../auth/middleWareAuth");

// Here we can accept json as a valid body object
router.use(express.json());

// This is the connection string to my Database, I am using this with the PG node js library so
// I can query the database. Also, the database is a MySQL Postgre server
const connectionString = process.env.CONNECTIONSTRING;

// Endpoint to authenticate user.
// it takes 2 paramerters:
// @param.username in the request body
// @param.password in the request body
router.post("/", auth.authenticateToken, (req, res) => {
  // Saving the values provided to Variables so the are easier to access
  const userName = req.body.username;
  const password = req.body.password;

  // Create a client constructor
  const client = new Client({
    connectionString,
  });

  // connect
  client.connect();

  // Query
  const query = "SELECT * FROM users WHERE username=$1";
  // Values
  const values = [userName];

  // This is the query callback function, it takes 1 parameter
  // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
  // client.query (query, values)...
  // A call back is a new form of ES6 Javascript syntax
  // Old syntax:
  // client.query('SELECT...' function(req, sqlRes) {...})
  // New syntax
  // client.query('SELECT...',  (req, sqlRes) => {})
  // This is to authenticate the user
  client.query(query, values, (err, sqlRes) => {
    // Is error, then we set status and return an error to user
    if (err) {
      res.status(500).json({ result: "Internal Server Error" });
    }
    // else if the rows returned are 0, then we know the user does not exist
    else if (sqlRes.rowCount === 0) {
      res.status(500).json({ result: "Username Incorect." });
    }
    // else we know the username is correct, and the user is in the database
    else {
      // if the password is equal to the password provided, then the user is authenticated
      if (sqlRes.rows[0].password === password) {
        res.status(200).json({ result: "Authenticated" });
        client.end();
      }
      // else we return an error
      else {
        res.status(500).json({ result: "Password incorrect" });
      }
    }
  });
});

// export the module so we can access it from the index page
module.exports = router;
