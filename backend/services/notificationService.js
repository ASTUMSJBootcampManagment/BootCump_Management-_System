const Notification = require(
  "../models/Notification"
);

const createNotificationSignal = async ({
  recipient,
  title,
  message,
  type,
}) => {
  if (
    !recipient ||
    !title ||
    !message ||
    !type
  ) {
    throw new Error(
      "recipient, title, message and type are required."
    );
  }

  const notification =
    await Notification.create({
      recipient,
      title,
      message,
      type,
    });

  return notification;
};

module.exports = {
  createNotificationSignal,
};