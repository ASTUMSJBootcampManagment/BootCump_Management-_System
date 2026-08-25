const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: "Student",
      name,
    });

    await newUser.save();

    return res.status(201).json({
      status: "pending",
      message: "Registration submitted successfully. Your account is pending admin approval."
    });
  } catch (error) {
    next(error);  }
};

exports.registerMentor = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newMentor = new User({
      email,
      password: hashedPassword,
      role: "Mentor",
      name,
      status: "approved" 
    });

    await newMentor.save();

    return res.status(201).json({
      status: "approved",
      message: "Mentor created successfully."
    });
  } catch (error) {
    next(error);
  }
};
exports.UpdateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Please provide either 'approved' or 'rejected'." 
      });
    }
    const updatedStudent = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json({
      message: `Student status successfully updated to ${status}.`,
      student: updatedStudent
    });

  } catch (error) {
    next(error);  }
};