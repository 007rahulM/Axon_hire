// backend/routes/authRoutes.js
//handles user registration and login logic

const express = require("express");// import the express
const router = express.Router(); //express router to create routes
const bcrypt = require("bcryptjs"); //for password hashing
const User = require("../models/User"); //import user model
const jwt = require("jsonwebtoken");// new import for tusing the jwt

//register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password,confirm } = req.body;//extract user data from the body

    // --- Validation (from our lesson) ---
    if (!name || !email || !password ||!confirm) {
      return res.status(400).json({ message: "Please enter all fields." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hash the passwrod before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user
    const newUser = new User({ name, email, password: hashedPassword,confirm });
    
    //  This is the line that saves to the database
    await newUser.save(); 

    // Send a success message
    res.status(201).json({ message: "User registered sucessfully" });
    
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// login with JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "USer not found" }); // This is the 400 Bad Request you see
    
    //comapre password with hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" }); // This is also a 400 Bad Request

    //check jwt token
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role, // This is the fix to include the role
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "12h" } // expires in 12 hour
    );

    // send toke +user data to the frontend
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;