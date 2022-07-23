// Like in the index.js page we are importing the express library as a var called express
const express = require("express");
let router = express.Router(); // This is a route, we are simply just using a let var and exporting it so we can split up our code and makeing it easier to read
// This is the node js lirary I've chosen to go with to query my SQL server
const { Pool, Client } = require("pg");
require("dotenv").config({ path: "../../.env" }); // dot env

// authentication middleware
const auth = require("../auth/middleWareAuth");

// Here we can accept json as a valid body object
router.use(express.json());

// This is the connection string to my Database, I am using this with the PG node js library so
// I can query the database. Also, the database is a MySQL Postgre server
const connectionString = process.env.CONNECTIONSTRING;

// This is the main route to delete a user from the database
// it takes 6 total paramers:
// @req.body[0] param name;
// @req.body[0] param password;
// There are 2 jsons passes, one for auth, and one for data
// body[0] is for auth, and body[1] is for data
// @req.body[1] param username;
// @req.body[1] param firstname;
// @req.body[1] param lastname;
// @req.body[1] param password;
router.delete("/", auth.authenticateToken, (req, res) => {
  // Saving the value from the req.body
  const userNameSQL = req.body.username;

  if (userNameSQL === "" || userNameSQL === null) {
    res.status(404).json({ result: "Please provide username" });
  }

  const query = 'DELETE FROM "users" WHERE username=$1;';
  const values = [userNameSQL];

  // Creating a constructor called 'client' with the connectionString from the .env file
  const client = new Client({
    connectionString,
  });

  // Connect
  client.connect();
  // This is the query callback function, it takes 1 parameter
  // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
  // client.query (query, values)...
  // A call back is a new form of ES6 Javascript syntax
  // Old syntax:
  // client.query('SELECT...', function(req, sqlRes) {...})
  // New syntax
  // client.query('SELECT...',  (req, sqlRes) => {...})
  client.query(query, values, (err, sqlRes) => {
    // Here we are checking for errors, if we get them then we throw an 500 status code and an Internal Server Error
    if (err) {
      res.status(500).json({ result: "Internal Server Error" });
    } else if (sqlRes.rowCount === 0) {
      res.status(404).json({ error: "User not in database" });
    } else {
      res.send(sqlRes.rows[0]);
      client.end();
    }
  });
});

// Exporting the module so we can use this from the index.html page
module.exports = router;
