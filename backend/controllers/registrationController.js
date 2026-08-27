const User = require("../models/userModel");
const generateTemporaryPassword = require("../utils/generateTemporaryPassword");
const sendEmail = require("../utils/sendEmail");

/*
=====================================================
STUDENT REGISTRATION
=====================================================
*/

exports.register = async (req, res) => {
  try {
    const {
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

    // ==========================================
    // CHECK REQUIRED FIELDS
    // ==========================================

    if (
      !name ||
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
        message: "Please fill in all required fields.",
      });
    }

    // ==========================================
    // CHECK BOOLEAN FIELDS
    // ==========================================

    if (
      typeof hasConstantInternet !== "boolean" ||
      typeof hasPersonalLaptop !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please answer whether you have constant internet and a personal laptop.",
      });
    }

    // ==========================================
    // VALIDATE GENDER
    // ==========================================

    if (!["Male", "Female"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid gender.",
      });
    }

    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // ==========================================
    // GENERATE TEMPORARY PASSWORD
    // ==========================================
    //
    // The student does NOT enter a password.
    //
    // We still need a password because the User model
    // requires one.
    //
    // This password will NOT be sent to the student yet.
    //
    // A new temporary password will be generated when
    // the admin approves the account.
    //
    // ==========================================

    const placeholderPassword = generateTemporaryPassword();

    // ==========================================
    // CREATE STUDENT APPLICATION
    // ==========================================

    const newUser = new User({
      name: name.trim(),

      email: normalizedEmail,

      /*
      Public registration is ONLY for students.
      Never trust role from the frontend.
      */
      role: "Student",

      /*
      Student must be approved by admin.
      */
      status: "pending",

      /*
      Required by userModel.
      The student does NOT know this password.
      */
      password: placeholderPassword,

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
    });

    await newUser.save();

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(201).json({
      success: true,
      status: "pending",
      message:
        "Registration submitted successfully. Your account is pending admin approval.",
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================================
ADMIN: UPDATE STUDENT REGISTRATION STATUS
=====================================================
*/

exports.UpdateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ==========================================
    // VALIDATE STATUS
    // ==========================================

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Please provide either 'approved' or 'rejected'.",
      });
    }

    // ==========================================
    // FIND STUDENT
    // ==========================================

    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // ==========================================
    // MAKE SURE USER IS A STUDENT
    // ==========================================

    if (student.role !== "Student") {
      return res.status(400).json({
        success: false,
        message: "Only student registrations can be approved or rejected.",
      });
    }

    // ==========================================
    // REJECT STUDENT
    // ==========================================

    if (status === "rejected") {
      student.status = "rejected";

      await student.save();

      return res.status(200).json({
        success: true,
        message: "Student registration rejected successfully.",
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          status: student.status,
        },
      });
    }

    // ==========================================
    // APPROVE STUDENT
    // ==========================================

    /*
    Generate a NEW temporary password.
    */

    const temporaryPassword = generateTemporaryPassword();

    /*
    Assign it to the model.

    Your userModel's pre-save hook will hash it.
    */

    student.password = temporaryPassword;

    student.status = "approved";

    student.verified = true;

    await student.save();

    // ==========================================
    // SEND TEMPORARY PASSWORD BY EMAIL
    // ==========================================

    await sendEmail({
      to: student.email,

      subject: "ASTU MSJ Bootcamp - Account Approved",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          background: #f8fafc;
          padding: 30px;
        ">

          <div style="
            background: #062A5C;
            color: white;
            padding: 25px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          ">

            <h1 style="margin: 0;">
              ASTU MSJ
            </h1>

            <p style="margin: 8px 0 0;">
              BOOTCAMP
            </p>

          </div>

          <div style="
            background: white;
            padding: 30px;
            border-radius: 0 0 12px 12px;
          ">

            <h2>
              Hello ${student.name},
            </h2>

            <p>
              Your registration for the ASTU MSJ Bootcamp
              has been approved by the administrator.
            </p>

            <p>
              You can now log in using your email address
              and the temporary password below.
            </p>

            <div style="
              margin: 25px 0;
              padding: 20px;
              background: #f1f5f9;
              border-radius: 10px;
              text-align: center;
            ">

              <p style="
                margin: 0 0 8px;
                color: #64748b;
                font-size: 13px;
              ">
                Temporary Password
              </p>

              <strong style="
                font-size: 22px;
                color: #062A5C;
                letter-spacing: 2px;
              ">
                ${temporaryPassword}
              </strong>

            </div>

            <p>
              Please keep your temporary password secure.
            </p>

            <p>
              After logging in, please change your password.
            </p>

            <br />

            <p style="color: #64748b;">
              Regards,<br />
              <strong>ASTU MSJ Bootcamp Team</strong>
            </p>

          </div>
        </div>
      `,
    });

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(200).json({
      success: true,
      message:
        "Student approved successfully and temporary password sent by email.",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        status: student.status,
      },
    });
  } catch (error) {
    console.error("Update registration status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
