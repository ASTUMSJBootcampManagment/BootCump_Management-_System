const validateRequired = (
  fields = []
) => {
  return (req, res, next) => {
    const missing = [];

    fields.forEach((field) => {
      const value =
        req.body[field];

      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields are missing.",
        fields: missing,
      });
    }

    next();
  };
};

const validateEmail = (
  req,
  res,
  next
) => {
  const { email } = req.body;

  if (!email) {
    return next();
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide a valid email address.",
    });
  }

  next();
};

const validateRole = (
  req,
  res,
  next
) => {
  const allowedRoles = [
    "Admin",
    "Mentor",
    "Student",
  ];

  if (
    req.body.role &&
    !allowedRoles.includes(
      req.body.role
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid user role.",
    });
  }

  next();
};

const validateBatch = (
  req,
  res,
  next
) => {
  const {
    name,
    year,
    startDate,
    endDate,
  } = req.body;

  if (
    name !== undefined &&
    String(name).trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Batch name cannot be empty.",
    });
  }

  if (
    year !== undefined &&
    isNaN(Number(year))
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Batch year must be a number.",
    });
  }

  if (
    startDate &&
    isNaN(
      new Date(startDate).getTime()
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid start date.",
    });
  }

  if (
    endDate &&
    isNaN(
      new Date(endDate).getTime()
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid end date.",
    });
  }

  if (
    startDate &&
    endDate &&
    new Date(startDate) >
      new Date(endDate)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Start date cannot be after end date.",
    });
  }

  next();
};

module.exports = {
  validateRequired,
  validateEmail,
  validateRole,
  validateBatch,
};