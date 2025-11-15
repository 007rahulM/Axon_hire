//this middleware runs after verificationtoken
//it assumes req.user has already been set by verifytoken

const adminMiddleware = (req, res, next) => {
  try {
    //1 we check the role of the user who made the request
    //this req.user object comes from the verifytoken middleware
    if (req.user.role !== "admin") {
      //2 if they are not an admin block them
      //403 forbidden means "i know who you are ,but you are not allowed"
      return res.status(403).json({ message: "Access denied Admin role reuires" });
    }

    //3 if they are an admin let them pass to the next function-(the api logic)
    next();
  } catch (err) {
    //4 if something unexpected happens
    console.error("admin middleware error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = adminMiddleware;