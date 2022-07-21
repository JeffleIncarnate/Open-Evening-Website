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

router.put("/:userName", (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.json({ result: "Body is Empty" });
  }

  // Here I am getting the name and password from auth json and I'm setting them to variables nameBody, and password body
  // so it's easier to read the code
  const nameBody = req.body[0].name;
  const passwordBody = req.body[0].password;

  // Checking the name provided from the body and I'm checking it against the secret one
  if (nameBody === name) {
    // Here I am checking the password provided from the body and I'm checking it against the secret one
    if (passwordBody === password) {
      const oldUserName = req.params.userName;

      if (req.body[1] == null || Object.keys(req.body[1]).length === 0) {
        res.json({ result: "Provide put values" });
      }

      const client = new Client({
        connectionString,
      });

      client.connect();

      // Checking if another user with the same username exists
      const existsQuery =
        "SELECT EXISTS(SELECT * from users WHERE username=$1);";
      const existsValues = [oldUserName];

      var userInDatabase = false;

      client.query(existsQuery, existsValues, (err, sqlRes) => {
        // err, set status and send
        if (err) {
          res.status(500).json({ result: "Internal Server Error" });
        } else if (sqlRes.rows[0].exists === true) {
          /// ------------------------
          // Construct the query
          let reqUpdate = req.body[1];

          let fullListKeys = [];
          let fullListValues = [];

          if (reqUpdate.username != "") {
            fullListKeys.push("username");
            fullListValues.push(reqUpdate.username);
          }
          if (reqUpdate.firstname != "") {
            fullListKeys.push("firstname");
            fullListValues.push(reqUpdate.firstname);
          }
          if (reqUpdate.lastname != "") {
            fullListKeys.push("lastname");
            fullListValues.push(reqUpdate.lastname);
          }
          if (reqUpdate.password != "") {
            fullListKeys.push("password");
            fullListValues.push(reqUpdate.password);
          }

          let query = "UPDATE users SET ";

          let i;

          for (i = 0; i < fullListKeys.length; i++) {
            let g = i + 1;
            query += fullListKeys[i] + `=$${g}, `;
          }

          query = query.slice(0, -2);

          query += ` WHERE username='${oldUserName}'`;

          client.query(query, fullListValues, (err, sqlRes) => {
            if (err) {
              res.status(500).json({ result: "Internal Server Error" });
            } else {
              res.status(201).json({ result: `Updated user ${oldUserName}` });
            }
          });
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