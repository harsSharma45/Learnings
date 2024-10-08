// Import necessary modules
const express = require("express");
const jwt = require("jsonwebtoken");

// Secret key for JWT signing and verification
const jwtSecret = "123456";

// Initialize the Express application
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory user database (for demonstration purposes)
const ALL_USERS = [
  {
    username: "incc.lkj@example.com", 
    password: "mypassword1",
    name: "incc lkj",
  },
  {
    username: "anon.user@example.com", 
    password: "mypassword2",
    name: "Anon User",
  },
  {
    username: "gs.shs@example.com", 
    password: "mypassword3",
    name: "GS Shs",
  },
];

// Helper function to check if the user exists in the database
function userExists(username, password) {
  return ALL_USERS.some(user => user.username === username && user.password === password);
}

// Route for user sign-in
app.post("/signin", (req, res) => {
  const { username, password } = req.body; // Destructure username and password from request body

  // Validate user credentials
  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User does not exist in our in-memory database",
    });
  }

  // Create a JWT token for the authenticated user
  const token = jwt.sign({ username }, jwtSecret);
  
  // Return the token to the client
  return res.json({ token });
});

// Route to get a list of users (protected)
app.get("/users", (req, res) => {
  const token = req.headers.authorization; // Get token from the authorization header

  if (!token) {
    return res.status(403).json({ msg: "No token provided" });
  }

  // Verify the provided token
  try {
    const decoded = jwt.verify(token, jwtSecret); // Decode the token
    const username = decoded.username;

    // Return all users excluding the authenticated user
    const otherUsers = ALL_USERS.filter(user => user.username !== username);
    return res.json({ users: otherUsers });
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
