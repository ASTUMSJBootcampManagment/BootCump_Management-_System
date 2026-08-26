const User = require("../models/userModel");
const generateTemporaryPassword = require("../utils/generateTemporaryPassword");
const sendEmail = require("../utils/sendEmail");

/*
|--------------------------------------------------------------------------
| APPROVE STUDENT
|--------------------------------------------------------------------------
*/

exports.approveStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (student.role !== "Student") {
      return res.status(400).json({
        success: false,
        message: "Only student accounts can be approved.",
      });
    }

    if (student.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "This student is already approved.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate temporary password
    |--------------------------------------------------------------------------
    */

    const temporaryPassword = generateTemporaryPassword();

    /*
    |--------------------------------------------------------------------------
    | Set password
    |--------------------------------------------------------------------------
    |
    | userModel pre-save hook will hash this automatically.
    |
    */

    student.password = temporaryPassword;

    student.status = "approved";

    student.verified = true;

    await student.save();

    /*
    |--------------------------------------------------------------------------
    | Send temporary password
    |--------------------------------------------------------------------------
    */

    await sendEmail({
      to: student.email,

      subject: "ASTU MSJ Bootcamp - Account Approved",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          background: #f8fafc;
        ">

          <div style="
            background: #062A5C;
            color: white;
            padding: 25px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          ">
            <h1 style="margin: 0;">
              ASTU MSJ Bootcamp
            </h1>

            <p style="margin-top: 8px;">
              Account Approved
            </p>
          </div>

          <div style="
            background: white;
            padding: 30px;
            border-radius: 0 0 12px 12px;
          ">

            <h2>Hello ${student.name},</h2>

            <p>
              Your ASTU MSJ Bootcamp registration has been approved.
            </p>

            <p>
              You can now log in using the temporary password below:
            </p>

            <div style="
              background: #f1f5f9;
              padding: 18px;
              border-radius: 10px;
              text-align: center;
              margin: 25px 0;
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
              Please keep this password secure.
            </p>

            <p>
              We recommend changing your password after your first login.
            </p>

            <p style="
              margin-top: 30px;
              color: #64748b;
            ">
              Regards,<br/>
              ASTU MSJ Bootcamp Team
            </p>

          </div>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "Student approved successfully and temporary password sent by email.",
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        status: student.status,
      },
    });
  } catch (error) {
    console.error("Approve student error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
