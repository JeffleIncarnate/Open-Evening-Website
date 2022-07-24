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

// These are the varaibles from the .env File and saving them as constants since they will never change
const name = process.env.NAME;
const password = process.env.PASSWORD;
// This is the connection string to my Database, I am using this with the PG node js library so
// I can query the database. Also, the database is a MySQL Postgre server
const connectionString = process.env.CONNECTIONSTRING;

// This is the endpoint to update a user,
router.put("/:userName", auth.authenticateToken, (req, res) => {
  // here we are simpley checking if the request body is null, or empty, is error, then we catch, and send it back
  try {
    if (Object.keys(req.body).length === 0) {
      res.json({ result: "Body is Empty" });
    }
  } catch (ex) {
    res.json(ex);
  }

  // Since we also need to be able to change the name, then we will get the previous
  // name from the url, and the new username from the request body
  const oldUserName = req.params.userName;

  // Createing a constructer for the client import which is part of the pg package
  const client = new Client({
    connectionString,
  });

  // Connect to database
  client.connect();

  // Checking if another user with the same username exists
  const existsQuery = "SELECT EXISTS(SELECT * from users WHERE username=$1);";
  const existsValues = [oldUserName];

  // This is the query callback function, it takes 2 parameters: Query, and Values (Values need to be provided as an array)
  // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
  // client.query (query, values)...
  // A call back is a new form of ES6 Javascript syntax
  // Old syntax:
  // client.query('SELECT...' function(req, sqlRes) {...})
  // New syntax
  // client.query('SELECT...',  (req, sqlRes) => {})
  client.query(existsQuery, existsValues, (err, sqlRes) => {
    // err, set status and send
    if (err) {
      res.status(500).json({ result: "Internal Server Error" });
    }
    // If the user does existm then we will construct the query.
    else if (sqlRes.rows[0].exists === true) {
      /// ------------------------
      // Construct the query
      let reqUpdate = req.body;

      // This is a list of all the keys that will be updated
      let fullListKeys = [];
      // This is a list that holds all the values of the keys that need to be updated.
      let fullListValues = [];

      // If username is not empty or null, then we will add it to the query
      if (reqUpdate.username != "") {
        fullListKeys.push("username");
        fullListValues.push(reqUpdate.username);
      }
      // If firstname is not empty or null, then we will add it to the query
      if (reqUpdate.firstname != "") {
        fullListKeys.push("firstname");
        fullListValues.push(reqUpdate.firstname);
      }
      // If lastname is not empty or null, then we will add it to the query
      if (reqUpdate.lastname != "") {
        fullListKeys.push("lastname");
        fullListValues.push(reqUpdate.lastname);
      }
      // If password is not empty or null, then we will add it to the query
      if (reqUpdate.password != "") {
        fullListKeys.push("password");
        fullListValues.push(reqUpdate.password);
      }
      // If email is not empty or null, then we will add it to the query
      if (reqUpdate.email != "") {
        fullListKeys.push("email");
        fullListValues.push(reqUpdate.email);
      }

      // This is the starting query
      let query = "UPDATE users SET ";

      // is a for loop that creates the paramerized query
      for (let i = 0; i < fullListKeys.length; i++) {
        // G is here to act as the counter, (which is just i + 1)
        // The reason for this is because Paramerters start at 1, while index's start at 1.
        let g = i + 1;
        // This addes the key, and the $1 paramer to the query
        query += fullListKeys[i] + `=$${g}, `; // e.g "firstname=$1"...
      }

      // since the foor loop, adds a space, and a comma to the end of the query, we will then slice the array by 2 index's / Characters
      query = query.slice(0, -2);

      // This is adds the username where the paramers above will be changed
      query += ` WHERE username='${oldUserName}'`;

      // Since I am doing string concatination (Which is the equivilent of using namespace std in C++)
      // It's not the safist, so I'm checking if they pulled a fast one and included 'DROP TABLE'
      if (query.includes("DROP TABLE") || query.includes("DROP")) {
        res.status(500).json({ result: "Not Today Satan." });
      }

      // This is the query callback function, it takes 2 parameters: Query, and values
      // @query 'SELECT ...' or 'INSERT INTO...' it can also take parameters with the $1 variable
      // client.query (query, values)...
      // A call back is a new form of ES6 Javascript syntax
      // Old syntax:
      // client.query('SELECT...' function(req, sqlRes) {...})
      // New syntax
      // client.query('SELECT...',  (req, sqlRes) => {})
      client.query(query, fullListValues, (err) => {
        // If error, we just send it back
        if (err) {
          res.status(500).json({ result: "Internal Server Error" });
        }
        // else we just send back success
        else {
          res.status(201).json({ result: `Updated user ${oldUserName}` });
          client.end();
        }
      });
    }
  });
});

module.exports = router;
