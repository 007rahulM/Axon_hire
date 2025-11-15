// backend/routes/aiRoutes.js
// This file handles all routes that talk to the AI

// 1. Import Express
const express = require("express");
// 2. Create the router
const router = express.Router();
// 3. Import our "security guard" (JWT checker)
const verifyToken = require("../middleware/authMiddleware");
// 4. Import the Google AI library
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 5. Initialize the Google AI client (it reads the key from .env)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/*
 * @route   POST /api/ai/generate-questions
 * @desc    Generate interview questions using Google Gemini
 * @access  Private (User must be logged in)
 */
// 6. Define the route
router.post("/generate-questions", verifyToken, async (req, res) => {
  // 7. Safety net: 'try...catch' block
  try {
    // 8. Get the 'jobTitle' from the request body (from Postman/React)
    const { jobTitle } = req.body;

    // 9. Validation
    if (!jobTitle) {
      return res.status(400).json({ message: "Job title is required." });
    }

    // 10. 🎯 FIX: Use the 'gemini-1.0-pro' model.
    // This is the most stable and widely available free-tier model.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 11. Create the instructions for the AI
    // 🎯 FIX: Use ${jobTitle} to inject the variable into the string.
    const prompt = `
      Act as an expert technical recruiter.
      I am a candidate applying for the position of: "${jobTitle}".
      Please generate 5 insightful, challenging interview questions that are specific
      to this role.
      Only return the list of questions, nothing else.
    `;

    // 12. Call the Google AI API
    const result = await model.generateContent(prompt);
    // 13. Get the response
    const response = await result.response;
    // 14. Get just the text
    const questions = response.text();
    
    // 15. Send the AI's answer back to the user
    res.status(200).json({ questions });
    
  } catch (err) {
    // 16. If anything in the 'try' block fails, send a server error
    console.error("AI generation error:", err.message);
    res.status(500).json({ message: "Error generating questions from AI." });
  }
});

// 17. Export this router so server.js can use it
module.exports = router;