const express = require("express");
const router=express.Router();
const vereifytoken=require("../middleware/authMiddleware");
const Application=require("../models/Application");
const Job=require("../models/Job");
const User=require("../models/User");

/*
@route post/api/applications/:jobID/apply
apply for a job using the user's saved Master Resume(easy apply)
private -user must be logged in

 */
router.post("/:jobId/apply",vereifytoken,async(req,res)=>{
try{
    const jobId=req.params.jobId;
    const userId=req.user.id;

    ///1 check if the jon exists
    const job=await Job.findById(jobId);
    if(!job){
        return res.status(400).json({message:"Job not found"});

    }

    //2 check if the user has a resume uploaded
    //we need to fetch the latest user data to check the resumeUrl
    const user=await User.findById(userId);
    if(!user.resumeUrl){
        return res.status(400).json({message:"No resume  found, Please upload your resume to your profile first"});

    }
    //3 check for duplicate application
    //has this user already applied for this specific job?
    const existingApplication=await Application.findOne({
        jobId:jobId,
        applicantId:userId
    });

    //4 create the new application
    const newApplication=new Application({
        jobId:jobId,
        applicantId:userId,
        resumeUrl:user.resumeUrl,//user the master resume
        status:"Submitted"//default status submitted
    });

    await newApplication.save();
    res.status(201).json({
        message:"Application submitted successfully",
        application:newApplication
    });
}catch(err){
    console.error("Application error:",err.message);
    res.status(500).json({message:"Server error during application"});
}
});

module.exports=router;