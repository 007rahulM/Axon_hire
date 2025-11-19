const adminMiddleware = (req, res, next) => {
  try {
    const role = req.user.role;

    console.log("user Id:", req.user.id);
    console.log("user role:", req.user.role);
    console.log(`security check: User role is '${role}'`);

    // Allow only recruiter or admin
    if (role !== "admin" && role !== "recruiter") {
      console.log("Access Denied: role is not authorized");
      return res.status(403).json({
        message: "Access denied. Admin or Recruiter role required",
      });
    }

    console.log("Access granted");
    next();
  } catch (err) {
    console.error("admin middleware error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = adminMiddleware;
