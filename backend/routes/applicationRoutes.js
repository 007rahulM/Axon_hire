const express = require("express");
const router = express.Router();
const vereifytoken = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

/*
@route POST /api/applications/:jobId/apply
apply for a job using the user's saved Master Resume (easy apply)
private - user must be logged in
*/
router.post("/:jobId/apply", vereifytoken, async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;

    // 1. Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2. Check if the user has a resume uploaded
    const user = await User.findById(userId);
    if (!user.resumeUrl) {
      return res.status(400).json({ message: "No resume found. Please upload your resume to your profile first." });
    }

    // 3. Check for duplicate application
    const existingApplication = await Application.findOne({
      jobId: jobId,
      applicantId: userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // 4. Create the new application
    const newApplication = new Application({
      jobId: jobId,
      applicantId: userId,
      resumeUrl: user.resumeUrl,
      status: "Submitted"
    });

    await newApplication.save();
    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication
    });
  } catch (err) {
    console.error("Application error:", err.message);
    res.status(500).json({ message: "Server error during application" });
  }
});

/*
@route GET /api/applications/recruiter
Get all applications for jobs posted by the logged-in recruiter
private - only recruiter can access
*/
router.get("/recruiter", vereifytoken, async (req, res) => {
  try {
    // 🎯 FIX: Use 'req.user.id' directly. 'userId' was not defined here.
    const jobs = await Job.find({ postedBy: req.user.id });

    // Extract just the IDs of those jobs
    const jobIds = jobs.map((job) => job._id);

    // Find applications that match those job Ids
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("applicantId", "name email") // get the candidate's name and email
      .populate("jobId", "title company");   // get the job title

    // Send the list back to the frontend
    res.status(200).json(applications);

  } catch (err) {
    console.error("Error fetching applications:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;