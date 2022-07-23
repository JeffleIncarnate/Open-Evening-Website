// Json web token is the middleware I've decided to use for Bearer Token Authentication
const jwt = require("jsonwebtoken");

// Middleware function to authenticate the api caller
// @param req = request
// @param res = response
// @param next = next is to tell the endpoint that the authentication is correct
function authenticateToken(req, res, next) {
  // Get the Header for auth
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "authentication": "Bearer [token]"
  if (token === null) return res.status(403).json({ result: "Forbidden" }); // Is null send error

  // Here we are verifying the token from the .env file
  // @param: token provided by user
  // @param: the env file token to check
  // Call back returns the user if correct
  // Err if it's in correct
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ result: "Forbidden" }); // Return error if token is wrong
    req.user = user;
    next(); // Then we tell the endpoint to continue
  });
}

// Export to use it in all files instead of having this function in the files
module.exports = { authenticateToken };
