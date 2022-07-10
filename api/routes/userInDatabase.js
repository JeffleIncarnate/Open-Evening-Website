const express = require("express");
let router = express.Router();

router.get("/checking", (req, res) => {
  res.send("Welcome to this super cool touter");
});

module.exports = router;
