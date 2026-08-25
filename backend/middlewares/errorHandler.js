const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal server error.";

  // Mongoose validation error
  if (
    err.name ===
    "ValidationError"
  ) {
    statusCode = 400;

    const errors = Object.values(
      err.errors
    ).map(
      (item) => item.message
    );

    return res.status(statusCode).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;

    const fields =
      Object.keys(
        err.keyValue || {}
      );

    return res.status(statusCode).json({
      success: false,
      message: `Duplicate value for: ${fields.join(
        ", "
      )}`,
    });
  }

  // Invalid Mongo ObjectId
  if (
    err.name ===
    "CastError"
  ) {
    statusCode = 400;

    message = "Invalid ID format.";
  }

  // JWT errors
  if (
    err.name ===
    "JsonWebTokenError"
  ) {
    statusCode = 401;

    message =
      "Invalid authentication token.";
  }

  if (
    err.name ===
    "TokenExpiredError"
  ) {
    statusCode = 401;

    message =
      "Authentication token has expired.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;