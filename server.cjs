const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE;
const port = process.env.PORT || 5000;

let dbClient = null;
let db = null;
let dbConnected = false;
let dbConnectionError = null;

// Connect to MongoDB
async function connectDB() {
  if (!uri) {
    dbConnectionError = "DATABASE environment variable not set in .env";
    console.error(dbConnectionError);
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    dbClient = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await dbClient.connect();
    db = dbClient.db();
    dbConnected = true;
    dbConnectionError = null;
    console.log("SUCCESS: Connected to MongoDB Database:", db.databaseName);
  } catch (err) {
    dbConnected = false;
    dbConnectionError = err.message;
    console.error("MongoDB connection failure:", err.message);
  }
}

connectDB();

// Helper to hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Endpoint to check database status
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: dbConnected,
    error: dbConnectionError,
    database: db ? db.databaseName : null
  });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  if (!dbConnected) {
    return res.status(503).json({ error: "Database not connected. Please check server logs or .env config." });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      if (existingUser.username === username.toLowerCase()) {
        return res.status(400).json({ error: "Username already registered" });
      }
      return res.status(400).json({ error: "Email already registered" });
    }

    // Insert new user
    const newUser = {
      username: username.toLowerCase(),
      displayName: username,
      email: email.toLowerCase(),
      password: hashPassword(password),
      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  if (!dbConnected) {
    return res.status(503).json({ error: "Database not connected. Please check server logs or .env config." });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const usersCollection = db.collection('users');

    // Find user by username or email
    const user = await usersCollection.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid username/email or password" });
    }

    // Verify password
    if (user.password !== hashPassword(password)) {
      return res.status(400).json({ error: "Invalid username/email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        username: user.displayName,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
