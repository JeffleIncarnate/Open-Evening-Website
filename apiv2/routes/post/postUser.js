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

// This is the main route to post a user to the database
// it takes 6 total paramers:
// @req.body[0] param name;
// @req.body[0] param password;
// There are 2 jsons passes, one for auth, and one for data
// body[0] is for auth, and body[1] is for data
// @req.body[1] param username;
// @req.body[1] param firstname;
// @req.body[1] param lastname;
// @req.body[1] param password;
router.post("/", (req, res) => {
  // Here I am getting the name and password from auth json and I'm setting them to variables nameBody, and password body
  // so it's easier to read the code
  const nameBody = req.body[0].name;
  const passwordBody = req.body[0].password;

  // Checking the name provided from the body and I'm checking it against the secret one
  if (nameBody === name) {
    // Here I am checking the password provided from the body and I'm checking it against the secret one
    if (passwordBody === password) {
      // Saving the values from req.body[1] and setting them to constants since they can't change
      const userNameSQl = req.body[1].username;
      const firstNameSQL = req.body[1].firstname;
      const lastNameSQL = req.body[1].lastname;
      const passwordSQL = req.body[1].password;
      const accountBalanceSQL = 0;

      // Paramerised query $1, $2 will be fille sin the order from the the array 'values' $1 == userNameSQL, $2 == firstNameSQL and so fourth
      let query =
        "INSERT INTO users (username, firstname, lastname, accountbalance, password) VALUES ($1, $2, $3, $4, $5)";
      const values = [
        userNameSQl,
        firstNameSQL,
        lastNameSQL,
        accountBalanceSQL,
        passwordSQL,
      ];

      // This is a for loop I've implemented to go through the values that the user gave, to make sure they provided all the values
      for (var i = 0; i < values.length; i++) {
        // Checking is value[i] == null, or nothing e.g {username: ""}, then it will be empty
        if (values[i] == null || values[i] == "") {
          switch (i) {
            case 0:
              res.status(404).json({ provide: "username" }); // Setting the status to 404 if nothing is provided, also sending username back if it's not provided
              break;
            case 1:
              res.status(404).json({ provide: "firstname" }); // Setting the status to 404 if nothing is provided, also sending firstname back if it's not provided
              break;
            case 2:
              res.status(404).json({ provide: "lastname" }); // Setting the status to 404 if nothing is provided, also sending lastname back if it's not provided
              break;
            case 4:
              res.status(404).json({ provide: "password" }); // Setting the status to 404 if nothing is provided, also sending password back if it's not provided
              break;
          }
        } else {
          // else we just continue
          continue;
        }
      }

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
      // client.query('SELECT...' function(req, sqlRes) {...})
      // New syntax
      // client.query('SELECT...',  (req, sqlRes) => {})
      client.query(query, values, (err, sqlRes) => {
        // Here we are checking for errors, if we get them then we throw an 500 status code and an Internal Server Error
        if (err) {
          res.status(500).json({ result: "Internal Server Error" });
        } else {
          res
            .status(201)
            .json({ result: `Created new instance of ${userNameSQl}` });
        }
      });
    } else {
      res.json({ result: "Wrong password." });
    }
  } else {
    res.json({ result: "Wrong username." });
  }
});

// Exporting the module so we can use this from the index.html page
module.exports = router;
