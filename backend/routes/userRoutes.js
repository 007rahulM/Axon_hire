//1 import our tools
const express=require("express");
const router=express.Router();
const verifyToken=require("../middleware/authMiddleware");//our logged-in security guard
const upload=require("../middleware/uploadMiddleware");//our new file catcher midddleware
const User=require("../models/User");//the user blueprint

/*
@route POST/api/users/upload-resume
-to upload or update a user's master resume
-its private user must be logged in to use

*/

/*/2 this is route wher 2 middleware guards are passing
-verifyToken runs first if user isn't logged in it stops
-upload.single('resume') runs second it looks for a file in the form-data
with the key resume it saves it to the uploads/folders
-if both pass our main async(req,res)=>....)'logic will runs

*/

router.post("/upload-resume",[verifyToken,upload.single("resume")],
async(req,res)=>{
    //3 at this point vereifytoken has given use req.user
    //and uploas has given us req.file
try{
    //4 check if the file uploads actually succeeded
    if(!req.file){
        return res.status(400).json({message:"No file uploaded"});

    }

    //5 get theunique path of the file multer just saved
    //req.file.path will be somethine lie "uploads.resume-1233.pdf"
    //we'll fix path separator for windows/links later if needed
    //  THE FIX: Manually construct the clean URL
        // Instead of relying on the messy system path, we just use the filename.
        // This creates "uploads/resume-123.pdf" perfectly every time.
       const resumeUrl = `/uploads/${req.file.filename}`;

    //6 find the logged-in user in the database and update their resumeURL field
    //req.user.id comes from our verifyToken middleware
    //{new:true} tells mongoose to send us back the updated use
    
    const updatedUser=await User.findByIdAndUpdate(req.user.id,{resumeUrl:resumeUrl},{new:true}).select("-password");//.secelct("-password") removes the password hash

    //7 send a succes message back to the frontend
    res.status(200).json({
        message:"Resume uploaded successfully",
        user:updatedUser,
        resumeUrl:resumeUrl,
    });

}catch(err){
    //8 our safety net if the database update fails
    console.error("Resume upload error:",err.message);
    res.status(500).json({message:"Server error during resume uploading"});
}
   
}
);


//9 exports the router so server.js can use it
module.exports=router;