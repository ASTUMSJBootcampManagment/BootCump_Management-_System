const Batch = require("../models/Batches");
const User = require("../models/userModel");

const getDashboardStats = async (req, res, next) => {
  try {
    const [users, batches] = await Promise.all([
      User.countDocuments(),
      Batch.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: { users, batches },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };