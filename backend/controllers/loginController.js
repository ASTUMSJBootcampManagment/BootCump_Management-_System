const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_PENDING",
        message:
          "Your application is still waiting for admin approval.",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_REJECTED",
        message:
          user.rejectionReason ||
          "Your application has been rejected.",
      });
    }

    const validPassword =
      await user.matchPassword(password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        status: user.status,
        mustChangePassword:
          user.mustChangePassword,
        assignedBatch:
          user.assignedBatch,
        assignedMentor:
          user.assignedMentor,
      },

      requiresPasswordChange:
        Boolean(user.mustChangePassword),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
};