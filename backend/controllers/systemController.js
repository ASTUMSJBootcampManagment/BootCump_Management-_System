const Batch = require("../models/Batches");
const SystemSettings = require("../models/SystemSettings");

exports.getRegistrationStatus = async (
  req,
  res
) => {
  try {
    const settings =
      await SystemSettings.findOne()
        .populate(
          "registrationBatch",
          "name year track startDate endDate status"
        );

    if (
      !settings ||
      !settings.registrationOpen ||
      !settings.registrationBatch
    ) {
      return res.json({
        success: true,
        open: false,
        batch: null,
      });
    }

    return res.json({
      success: true,
      open: true,
      batch:
        settings.registrationBatch,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to check registration status.",
    });
  }
};

exports.openRegistration = async (
  req,
  res
) => {
  try {
    const { batchId } =
      req.body;

    const batch =
      await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    if (batch.status === "Completed") {
      return res.status(400).json({
        success: false,
        message:
          "Registration cannot be opened for a completed batch.",
      });
    }

    await Batch.updateMany(
      {
        registrationEnabled: true,
      },
      {
        registrationEnabled: false,
        registrationClosedAt:
          new Date(),
      }
    );

    batch.registrationEnabled =
      true;

    batch.registrationOpenedAt =
      new Date();

    batch.registrationClosedAt =
      null;

    await batch.save();

    let settings =
      await SystemSettings.findOne();

    if (!settings) {
      settings =
        new SystemSettings();
    }

    settings.registrationOpen =
      true;

    settings.registrationBatch =
      batch._id;

    settings.registrationOpenedAt =
      new Date();

    settings.registrationClosedAt =
      null;

    settings.updatedBy =
      req.user._id;

    await settings.save();

    return res.json({
      success: true,
      message:
        "Registration opened successfully.",
      data: batch,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to open registration.",
    });
  }
};

exports.closeRegistration = async (
  req,
  res
) => {
  try {
    const settings =
      await SystemSettings.findOne();

    if (settings?.registrationBatch) {
      await Batch.findByIdAndUpdate(
        settings.registrationBatch,
        {
          registrationEnabled:
            false,
          registrationClosedAt:
            new Date(),
        }
      );
    }

    if (settings) {
      settings.registrationOpen =
        false;

      settings.registrationClosedAt =
        new Date();

      await settings.save();
    }

    return res.json({
      success: true,
      message:
        "Registration closed successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to close registration.",
    });
  }
};