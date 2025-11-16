//1 import express to create the router
const express = require("express");
//2 create a new route "mini-app"
const router = express.Router();
//3 import our job blueprint
const Job = require("../models/Job");
//4 import our-security guard middleware
const verifyToken = require("../middleware/authMiddleware");
// new import the admin middleware
const adminMiddleware = require("../middleware/adminMiddleware");

/*1..
1)@route   GET/api/jobs
2)@desc   get  all jobs listings
3)@access Public-anyone can see the jobs
*/
router.get("/jobs", async (req, res) => {
  try {
    //5 find all documents in the "job" colletion
    const jobs = await Job.find();
    //6 send the list of jobs back to the frontend as JSON
    res.status(200).json(jobs);
  } catch (err) {
    //7 if anything goes wrong,log it and send a server error
    console.error("Error fetching jobs:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/*2..
1)@route POST/api/jobs
2)@desc Create a new job listing
3)@acces Private - Admin Only
*/
//8 notice [verifyToken, adminMiddleware] is here
router.post("/jobs", [verifyToken, adminMiddleware], async (req, res) => {
  try {
    //9 get the job details from the frontend's request body
    const { title, company, location, salary } = req.body;

    //10 optional but good-check if all rewuired fields are there
    if (!title || !company || !location || !salary) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    //11 create a new job in memory
    const newJob = new Job({
      title,
      company,
      location,
      salary,
      postedBy: req.user.id
    });

    //12 save the new job to the MongoDB database
    const savedJob = await newJob.save();

    //13 send the newly created job back as confirmation
    res.status(201).json(savedJob); //201 means -created
  } catch (err) {
    //14 if anything goes wrong senf a server error
    console.error("Error posting job:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

//15 export this router so server.js can use it
module.exports = router;