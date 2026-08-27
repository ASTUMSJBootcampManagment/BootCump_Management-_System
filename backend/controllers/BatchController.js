const Batch = require("../models/Batches");
const User = require("../models/userModel");

exports.createBatch = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      year,
      track,
      startDate,
      endDate,
    } = req.body;

    if (
      !name ||
      !year ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, year, start date and end date are required.",
      });
    }

    const batch =
      await Batch.create({
        name,
        year,
        track:
          track ||
          "Full-Stack MERN Development",
        startDate,
        endDate,
        status: "Upcoming",
      });

    return res.status(201).json({
      success: true,
      message:
        "Batch created successfully.",
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBatches = async (
  req,
  res,
  next
) => {
  try {
    const batches =
      await Batch.find()
        .populate(
          "mentors",
          "fullname email role"
        )
        .populate(
          "students",
          "fullname email role status applicationStatus assignedMentor"
        )
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: batches,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBatchById = async (
  req,
  res,
  next
) => {
  try {
    const batch =
      await Batch.findById(
        req.params.id
      )
        .populate(
          "mentors",
          "fullname email role"
        )
        .populate(
          "students",
          "fullname email role status assignedMentor"
        );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    res.json({
      success: true,
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBatch = async (
  req,
  res,
  next
) => {
  try {
    const allowed = [
      "name",
      "year",
      "track",
      "startDate",
      "endDate",
      "status",
    ];

    const updates = {};

    allowed.forEach((key) => {
      if (
        req.body[key] !==
        undefined
      ) {
        updates[key] =
          req.body[key];
      }
    });

    const batch =
      await Batch.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Batch updated successfully.",
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBatch = async (
  req,
  res,
  next
) => {
  try {
    const batch =
      await Batch.findById(
        req.params.id
      );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    if (
      batch.students.length ||
      batch.mentors.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A batch with students or mentors cannot be deleted.",
      });
    }

    await batch.deleteOne();

    res.json({
      success: true,
      message:
        "Batch deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

exports.assignMentorToBatch = async (
  req,
  res,
  next
) => {
  try {
    const {
      mentorId,
    } = req.body;

    const batch =
      await Batch.findById(
        req.params.id
      );

    const mentor =
      await User.findById(
        mentorId
      );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    if (
      !mentor ||
      mentor.role !== "Mentor"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Valid mentor not found.",
      });
    }

    batch.mentors.push(
      mentor._id
    );

    batch.mentors =
      [
        ...new Map(
          batch.mentors.map(
            (id) => [
              String(id),
              id,
            ]
          )
        ).values(),
      ];

    await batch.save();

    res.json({
      success: true,
      message:
        "Mentor assigned to batch.",
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

exports.enrollStudentInBatch =
  async (req, res, next) => {
    try {
      const {
        studentId,
      } = req.body;

      const batch =
        await Batch.findById(
          req.params.id
        );

      const student =
        await User.findById(
          studentId
        );

      if (!batch || !student) {
        return res.status(404).json({
          success: false,
          message:
            "Batch or student not found.",
        });
      }

      if (
        student.role !==
        "Student"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Selected user is not a student.",
        });
      }

      student.assignedBatch =
        batch._id;

      student.appliedBatch =
        batch._id;

      student.status =
        "approved";

      student.applicationStatus =
        "approved";

      await student.save();

      batch.students.push(
        student._id
      );

      batch.students =
        [
          ...new Map(
            batch.students.map(
              (id) => [
                String(id),
                id,
              ]
            )
          ).values(),
        ];

      await batch.save();

      res.json({
        success: true,
        message:
          "Student enrolled successfully.",
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  };

exports.completeBatch = async (
  req,
  res,
  next
) => {
  try {
    const batch =
      await Batch.findById(
        req.params.id
      );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    if (
      req.body.confirm !== true
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Batch completion requires explicit confirmation.",
      });
    }

    batch.status =
      "Completed";

    batch.completedAt =
      new Date();

    batch.registrationEnabled =
      false;

    batch.registrationClosedAt =
      new Date();

    await batch.save();

    return res.json({
      success: true,
      message:
        "Batch has been marked as completed.",
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};