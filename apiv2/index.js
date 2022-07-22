// This is like imports in python:
// We are saving the package as Express and Cors into their own variables. 'express' and 'cors'
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // This is the dotenv package, so we can read an environment file and variables then save them to a var

// Below are all the routers we will be using, basically these are routes that we made but are in different files.
// GET
const getAllUsers = require("./routes/get/getAllUsers");
const getSpecificUser = require("./routes/get/getSpecificUser");

// POST
const postUser = require("./routes/post/postUser");

// DELETE
const deteteUser = require("./routes/delete/deleteUser");

// PUT
const updateUser = require("./routes/put/updateUser");
// Put (Add Money)
const addMoneyCheckings = require("./routes/put/add-money/add-checkings/addCheckings");
const addMoneySavings = require("./routes/put/add-money/add-savings/addSavings");

// Put (Transfer Money)
const transferMoneyCheckings = require("./routes/put/transfer-money/transfer-checkings/transferToCheckings");
const transferMoneySavings = require("./routes/put/transfer-money/transfer-savings/transferToSavings");
const transferMoneyToAnotherUser = require("./routes/put/transfer-money/transfer-another-user/transferToAnotherUser");

// Here is a constructor for express so we don't have to use express() whenever making a new
// endpoint e.g
/// express().get...
/// where as we cal just use > app.get("/", (req, res) => ) which is also a fancy callback function
const app = express();
app.use(express.json()); // This is using express.json so we can accept json as a valid body

// Route Uses
// GET
app.use("/allUsers", getAllUsers);
app.use("/specificUser", getSpecificUser);

// POST
app.use("/postUser", postUser);

// DELETE
app.use("/deleteUser", deteteUser);

// Put
app.use("/updateUser", updateUser);

// PUT (Add money to account)
app.use("/addMoneyCheckings", addMoneyCheckings);
app.use("/addMoneySavings", addMoneySavings);

// PUT (Transfer Money)
app.use("/transferMoneyCheckings", transferMoneyCheckings);
app.use("/transferMoneySavings", transferMoneySavings);

// Environment Variables
const name = process.env.NAME;
const password = process.env.PASSWORD;

// This is the 'https://localhost:3000/' root endpoint to make sure the user is valid, and he know's
// what to do next
app.get("/", async (req, res) => {
  // In this endpoint we are accept 2 body json keys: Name, and Password, this will be the new
  // authentication system
  if (req.body.name === name) {
    if (req.body.password == password) {
      res.json({
        result: "Please choose a real endpoint. Check the docs for more info",
      });
    } else {
      res.json({ result: "Wrong password." });
    }
  } else {
    res.json({ result: "Wrong username." });
  }
});

// This is to make the app listen on port 3000 of localhost.
app.listen(3000, () => {
  console.log("API listening on port " + 3000);
});
