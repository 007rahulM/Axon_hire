const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const User = require("../models/User");

/*
@route POST /api/users/upload-resume
To upload or update a user's master resume
*/
router.post("/upload-resume", verifyToken, (req, res) => {
    
    // 🎯 FIX: We wrap the upload middleware in a function to catch errors manually
    const uploadSingle = upload.single("resume");

    uploadSingle(req, res, async (err) => {
        // 1. Handle Multer/Cloudinary Errors specifically
        if (err) {
            console.error("Upload Middleware Error:", err);
            return res.status(500).json({ 
                message: "File upload failed", 
                error: err.message // This will show you the REAL reason in the frontend console
            });
        }

        // 2. Main logic runs only if upload succeeded
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const cloudUrl = req.file.path;
            console.log("File uploaded to Cloudinary:", cloudUrl);

            // 3. Update User
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            user.resumeUrl = cloudUrl;
            await user.save();

            res.status(200).json({
                message: "Resume uploaded successfully",
                user: user,
                resumeUrl: cloudUrl,
            });

        } catch (dbErr) {
            console.error("Database Error:", dbErr.message);
            res.status(500).json({ message: "Server error during database save" });
        }
    });
});

/*
@route GET /api/users/profile
Get current user profile including resume url
*/
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Profile error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;