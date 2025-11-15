// backend/server.js
// This is the main "control center" for your entire backend.

// --- 1. IMPORTS (Loading our tools) ---

// This line MUST be first. It loads all secret keys from your .env file
require("dotenv").config();

// Import Express: The main framework that builds the server
const express = require("express");
// Import Mongoose: The tool that lets us talk to our MongoDB database
const mongoose = require("mongoose");
// Import CORS: The middleware that allows our React app (on port 5173) to talk to this server (on port 5000)
const cors = require("cors");

// --- 2. IMPORT OUR ROUTE FILES ---
// We import the "mini-apps" we wrote for Auth, Jobs, and AI
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const aiRoutes = require("./routes/aiRoutes");
// Import our "security guard" middleware to check JWTs
const verifyToken = require("./middleware/authMiddleware");

// --- 3. INITIALIZE THE APP ---
// Create the main Express application "app"
const app = express();

// --- 4. MIDDLEWARE SETUP ---
// 'app.use()' means "run this on EVERY request that comes in"
// Use CORS to allow requests from any origin (e.g., your React app)
app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://axon-hire.vercel.app",      // your frontend deployed domain
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// Use Express's built-in JSON parser. This lets our server read the JSON data you send from Postman/React.
app.use(express.json());

// --- 5. API ROUTES (The "Address Book") ---
// Tell Express how to handle different URLs

// Any URL starting with "/api/auth" should be handled by 'authRoutes.js'
app.use("/api/auth", authRoutes);
// Any URL starting with "/api/jobs" should be handled by 'jobRoutes.js'
app.use("/api/jobs", jobRoutes);

// 🎯 THE FIX IS HERE:
// Any URL starting with "/api/ai" should be handled by 'aiRoutes.js'
// Your old code ("api/ai") was missing the '/' and broke the path.
app.use("/api/ai", aiRoutes);

// --- 6. TEST ROUTES (For Debugging) ---
// A simple "health check" route. If you go to http://localhost:5000/ in your browser, you'll see this.
app.get("/", (req, res) => {
  res.send("job portal backend is running");
});
// A test route to check if our 'verifyToken' guard is working
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "Access granted token verified", user: req.user });
});

// --- 7. MONGODB CONNECTION ---
// Connect to the MongoDB database using the secret URL from our .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ connected to mongoDB successfuly")) // This runs if the connection is a SUCCESS
  .catch((err) => console.log("❌ MongoDb connetion error:", err.message)); // This runs if the connection FAILS

// --- 8. START THE SERVER ---
// Get the port number from the .env file, or just use 5000 if it's not defined
const PORT = process.env.PORT || 5000;
// Tell the app to start "listening" for requests on our port
app.listen(PORT, () => console.log(`🚀 server stared on http://localhost:${PORT}`));