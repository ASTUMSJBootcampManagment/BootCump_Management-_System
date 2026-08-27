const Notification = require(
  "../models/Notification"
);

// =====================================================
// GET UNREAD NOTIFICATIONS
// GET /api/notifications
// =====================================================
const getNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await Notification.find({
        recipient: req.user._id,
        isRead: false,
      })
        .sort({ createdAt: -1 })
        .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// MARK AS READ
// PATCH /api/notifications/:id/read
// =====================================================
const markNotificationAsRead =
  async (req, res, next) => {
    try {
      const notification =
        await Notification.findOne({
          _id: req.params.id,
          recipient: req.user._id,
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      notification.isRead = true;

      await notification.save();

      res.status(200).json({
        success: true,
        message:
          "Notification marked as read.",
        notification,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getNotifications,
  markNotificationAsRead,
};