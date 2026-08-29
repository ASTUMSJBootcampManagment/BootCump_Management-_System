const Resource =
  require("../models/Resource");

const Batch =
  require("../models/Batches");

exports.createResource =
  async (req, res) => {
    try {
      const {
        title,
        description,
        type,
        url,
        batch,
      } = req.body;

      if (!title || !url) {
        return res.status(400).json({
          success: false,
          message:
            "Title and resource URL are required.",
        });
      }

      if (batch) {
        const exists =
          await Batch.findById(batch);

        if (!exists) {
          return res.status(404).json({
            success: false,
            message:
              "Selected batch not found.",
          });
        }
      }

      const resource =
        await Resource.create({
          title,
          description,
          type,
          url,
          batch: batch || null,
          createdBy:
            req.user._id,
        });

      const populated =
        await Resource.findById(
          resource._id
        ).populate(
          "createdBy",
          "fullname email role"
        );

      return res.status(201).json({
        success: true,
        message:
          "Resource created successfully.",
        data: populated,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to create resource.",
      });
    }
  };

exports.getResources =
  async (req, res) => {
    try {
      const batch =
        await Batch.findOne({
          students: req.user._id,
        }).select("_id");

      const query =
        req.user.role === "Student"
          ? {
              $or: [
                {
                  batch:
                    batch?._id ||
                    null,
                },
                {
                  batch: null,
                },
              ],
            }
          : {};

      const resources =
        await Resource.find(query)
          .populate(
            "createdBy",
            "fullname email role"
          )
          .populate(
            "batch",
            "name year track"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        data: resources,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to load resources.",
      });
    }
  };

exports.deleteResource =
  async (req, res) => {
    try {
      const resource =
        await Resource.findByIdAndDelete(
          req.params.id
        );

      if (!resource) {
        return res.status(404).json({
          success: false,
          message:
            "Resource not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Resource deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Unable to delete resource.",
      });
    }
  };