const User = require("../models/userModel");
const Batch = require("../models/Batches");

const generateTemporaryPassword = require("../utils/generateTemporaryPassword");

const sendEmail = require("../utils/sendEmail");

const createProgressForStudent = async (studentId, batchId) => {
  const Progress = require("../models/progress");

  const topics = await Progress.find({
    batch: batchId,
    student: null,
  }).lean();

  if (!topics.length) return;

  await Progress.insertMany(
    topics.map((topic) => ({
      topic: topic.topic,
      batch: batchId,
      student: studentId,
      status: "NotStarted",
    })),
  );
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await User.find({
      role: "Student",
      applicationStatus: {
        $in: ["waiting", "approved", "rejected"],
      },
    })
      .populate("appliedBatch", "name year track startDate endDate status")
      .populate("assignedMentor", "fullname email")
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to load student applications.",
    });
  }
};

exports.approveStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (student.role !== "Student") {
      return res.status(400).json({
        success: false,
        message: "Only student applications can be approved.",
      });
    }

    if (student.applicationStatus === "approved") {
      return res.status(400).json({
        success: false,
        message: "This student is already approved.",
      });
    }

    const batchId = req.body.batchId || student.appliedBatch;

    if (!batchId) {
      return res.status(400).json({
        success: false,
        message: "A batch must be selected before approving the student.",
      });
    }

    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    if (batch.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Students cannot be approved into a completed batch.",
      });
    }

    const temporaryPassword = generateTemporaryPassword();

    student.password = temporaryPassword;

    student.status = "approved";
    student.applicationStatus = "approved";
    student.verified = true;

    student.appliedBatch = batch._id;
    student.assignedBatch = batch._id;

    student.approvedAt = new Date();
    student.approvedBy = req.user._id;

    student.rejectionReason = "";

    student.mustChangePassword = true;

    student.temporaryPasswordExpiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7,
    );

    await student.save();

    await Batch.findByIdAndUpdate(batch._id, {
      $addToSet: {
        students: student._id,
      },
    });

    await createProgressForStudent(student._id, batch._id);

    await sendEmail({
      to: student.email,

      subject: "ASTU MSJ Bootcamp - Your Application Has Been Accepted",

      text: `
Hello ${student.fullname || "Student"},

Your ASTU MSJ Bootcamp application has been accepted.

Batch: ${batch.name}

Email: ${student.email}

Temporary password:
${temporaryPassword}

Please log in and change your temporary password immediately.

Your temporary password expires in 7 days.

ASTU MSJ Bootcamp Team
      `,

      html: `
<div style="
font-family:Arial,sans-serif;
background:#f5f7fa;
padding:30px;
">
  <div style="
  max-width:600px;
  margin:auto;
  background:white;
  border-radius:18px;
  overflow:hidden;
  ">
    
    <div style="
    background:#062a5c;
    color:white;
    padding:30px;
    ">
      <h1 style="margin:0">
        ASTU MSJ Bootcamp
      </h1>

      <p>
        Application Accepted
      </p>
    </div>

    <div style="padding:30px">
      <h2>
        Hello ${student.fullname || "Student"}
      </h2>

      <p>
        Congratulations! Your application
        has been accepted.
      </p>

      <p>
        You have been accepted into:
        <strong>${batch.name}</strong>
      </p>

      <div style="
      background:#f1f5f9;
      border-radius:14px;
      padding:20px;
      margin:25px 0;
      ">
        <p>
          <strong>Email</strong>
        </p>

        <p>
          ${student.email}
        </p>

        <p>
          <strong>Temporary Password</strong>
        </p>

        <p style="
        font-size:25px;
        font-weight:bold;
        letter-spacing:3px;
        color:#062a5c;
        ">
          ${temporaryPassword}
        </p>
      </div>

      <p>
        Log in with this temporary password
        and create your own password.
      </p>

      <p style="
      color:#64748b;
      ">
        The temporary password expires
        in 7 days.
      </p>

      <p>
        ASTU MSJ Bootcamp Team
      </p>
    </div>
  </div>
</div>
      `,
    });

    return res.json({
      success: true,
      message:
        "Student approved, enrolled into the batch, and temporary password sent by email.",
      data: {
        id: student._id,
        fullname: student.fullname,
        email: student.email,
        batch: batch.name,
        status: student.status,
      },
    });
  } catch (error) {
    console.error("Approve student error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to approve student.",
    });
  }
};

exports.rejectStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const reason = String(req.body.reason || "").trim();

    student.status = "rejected";
    student.applicationStatus = "rejected";
    student.rejectedAt = new Date();
    student.rejectionReason = reason || "Your application was not selected.";

    await student.save();

    try {
      await sendEmail({
        to: student.email,

        subject: "ASTU MSJ Bootcamp - Application Update",

        text: `
Hello ${student.fullname || "Student"},

Unfortunately, your ASTU MSJ Bootcamp application was not selected.

Reason:
${student.rejectionReason}

ASTU MSJ Bootcamp Team
        `,

        html: `
<h2>ASTU MSJ Bootcamp</h2>
<p>
Hello ${student.fullname || "Student"},
</p>
<p>
Unfortunately, your application was not selected.
</p>
<p>
<strong>Reason:</strong>
${student.rejectionReason}
</p>
        `,
      });
    } catch (emailError) {
      console.error("Rejection email failed:", emailError.message);
    }

    return res.json({
      success: true,
      message: "Student application rejected.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to reject student.",
    });
  }
};

exports.getMentors = async (req, res) => {
  try {
    const mentors = await User.find({
      role: "Mentor",
    })
      .select("-password")
      .sort({ fullname: 1 });

    return res.json({
      success: true,
      data: mentors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load mentors.",
    });
  }
};

exports.createMentor = async (req, res) => {
  try {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const exists = await User.findOne({
      email: normalizedEmail,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "An account already exists with this email.",
      });
    }

    const temporaryPassword = generateTemporaryPassword();

    const mentor = await User.create({
      fullname: fullname.trim(),
      email: normalizedEmail,
      password: temporaryPassword,
      role: "Mentor",
      status: "approved",
      verified: true,
      mustChangePassword: true,
      temporaryPasswordExpiresAt: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7,
      ),
    });

    await sendEmail({
      to: mentor.email,

      subject: "ASTU MSJ Bootcamp - Mentor Account",

      text: `
Your mentor account has been created.

Email:
${mentor.email}

Temporary password:
${temporaryPassword}

Please change your password after login.
      `,

      html: `
<h2>ASTU MSJ Bootcamp</h2>

<p>
Your mentor account has been created by the administrator.
</p>

<p>
<strong>Email:</strong>
${mentor.email}
</p>

<p>
<strong>Temporary password:</strong>
</p>

<h2>${temporaryPassword}</h2>

<p>
Please change your password after login.
</p>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Mentor created and login details sent by email.",
      data: {
        id: mentor._id,
        fullname: mentor.fullname,
        email: mentor.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create mentor.",
    });
  }
};

exports.assignMentorToStudent = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    const student = await User.findById(studentId);

    const mentor = await User.findById(mentorId);

    if (!student || student.role !== "Student") {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (!mentor || mentor.role !== "Mentor") {
      return res.status(404).json({
        success: false,
        message: "Mentor not found.",
      });
    }

    if (!student.assignedBatch) {
      return res.status(400).json({
        success: false,
        message: "Student is not enrolled in a batch.",
      });
    }

    const batch = await Batch.findById(student.assignedBatch);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Student batch not found.",
      });
    }

    if (!batch.mentors.some((id) => String(id) === String(mentor._id))) {
      return res.status(400).json({
        success: false,
        message: "This mentor is not assigned to the student's batch.",
      });
    }

    student.assignedMentor = mentor._id;

    await student.save();

    return res.json({
      success: true,
      message: "Mentor assigned successfully.",
      data: {
        studentId: student._id,
        mentorId: mentor._id,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to assign mentor.",
    });
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    const users = await User.find(filter)
      .select("-password")
      .populate("assignedBatch", "name year status track")
      .populate("assignedMentor", "fullname email")
      .populate("appliedBatch", "name year status track")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
exports.getApplication = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .populate("appliedBatch", "name year track startDate endDate status")
      .populate("assignedMentor", "fullname email")
      .select("-password");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found." });
    }

    return res.json({ success: true, data: student });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignMentorToBatch = async (req, res) => {
  
  res.json({ success: true, message: "Assign mentor to batch endpoint" });
};

exports.completeBatch = async (req, res) => {
  res.json({ success: true, message: "Complete batch endpoint" });
};
