const User = require("../models/userModel");
const Batch = require("../models/Batches");
const SystemSettings = require("../models/SystemSettings");
const generateTemporaryPassword = require("../utils/generateTemporaryPassword");

exports.register = async (req, res) => {
  try {
    const {
      fullname,
      name,  
      email,
      universityId,
      codeforcesAccount,
      leetcodeAccount,
      githubAccount,
      reasonToJoin,
      telegramUsername,
      phoneNumber,
      gender,
      hasConstantInternet,
      hasPersonalLaptop,
    } = req.body;

    const applicantName = fullname || name;

    

    const settings = await SystemSettings.findOne();

    if (!settings || !settings.registrationOpen) {
      return res.status(403).json({
        success: false,
        code: "REGISTRATION_CLOSED",
        message: "Registration is currently closed.",
      });
    }

    if (!settings.registrationBatch) {
      return res.status(403).json({
        success: false,
        code: "NO_REGISTRATION_BATCH",
        message: "There is currently no batch accepting applications.",
      });
    }

    const batch = await Batch.findById(settings.registrationBatch);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "The registration batch could not be found.",
      });
    }

    if (!batch.registrationEnabled) {
      return res.status(403).json({
        success: false,
        code: "REGISTRATION_CLOSED",
        message: "Registration for this batch is closed.",
      });
    }

  

    if (
      !applicantName ||
      !email ||
      !universityId ||
      !codeforcesAccount ||
      !leetcodeAccount ||
      !githubAccount ||
      !reasonToJoin ||
      !telegramUsername ||
      !phoneNumber ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });
    }

    if (
      typeof hasConstantInternet !== "boolean" ||
      typeof hasPersonalLaptop !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please answer the internet and laptop questions.",
      });
    }

    if (!["Male", "Female"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender.",
      });
    }


    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An application or account already exists for this email.",
      });
    }


    const placeholderPassword = generateTemporaryPassword();

    const student = await User.create({
      fullname: applicantName.trim(),
      email: normalizedEmail,
      password: placeholderPassword,
      role: "Student",
      status: "pending",
      applicationStatus: "waiting",
      appliedBatch: batch._id,
      universityId: universityId.trim(),
      codeforcesAccount: codeforcesAccount.trim(),
      leetcodeAccount: leetcodeAccount.trim(),
      githubAccount: githubAccount.trim(),
      reasonToJoin: reasonToJoin.trim(),
      telegramUsername: telegramUsername.trim(),
      phoneNumber: phoneNumber.trim(),
      gender,
      hasConstantInternet,
      hasPersonalLaptop,
      verified: false,
      mustChangePassword: false,
    });

    return res.status(201).json({
      success: true,
      status: "waiting",
      message:
        "Your application has been submitted and placed on the waiting list.",
      batch: {
        id: batch._id,
        name: batch.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit registration.",
    });
  }
};