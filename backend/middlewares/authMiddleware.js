const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decode.id || decode._id || decode.userId;

      if (!userId) {
        console.error("JWT Payload missing ID. Decoded token:", decode);
        return res.status(400).json({ message: "Invalid token payload structure" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.status === "pending") {
        return res.status(403).json({
          message: "Your account is pending approval. You cannot access this feature yet.",
        });
      }

      if (user.status === "rejected") {
        return res.status(403).json({
          message: "Your account request has been rejected.",
        });
      }

      req.user = user;
      console.log("The verified user is : ", req.user.email);
      next();
    } catch (err) {
      console.error("JWT Verification Failed Error:", err.message);

      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired. Please log in again." });
      }

      res.status(400).json({ message: "Token is not valid", details: err.message });
    }
  } else {
    return res
      .status(401)
      .json({ message: "No token, authorization denied" });
  }
};

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = { verifyToken, restrictTo };