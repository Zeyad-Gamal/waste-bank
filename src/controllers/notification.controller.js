const notificationService = require('../services/notification.service');


exports.getNotifications = async (req, res, next) => {
  try {

    const result =
      await notificationService.getUserNotifications(
        req.user.id,
        {
          page: req.query.page,
          limit: req.query.limit,
          unreadOnly:
            req.query.unreadOnly === 'true',
        }
      );

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    next(error);
  }
};


exports.getUnreadCount = async (req, res, next) => {
  try {

    const count =
      await notificationService.getUnreadCount(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: {
        count,
      },
    });

  } catch (error) {
    next(error);
  }
};


exports.markAsRead = async (req, res, next) => {
  try {

    const notification =
      await notificationService.markAsRead(
        req.params.id,
        req.user.id
      );

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });

  } catch (error) {
    next(error);
  }
};


exports.markAllAsRead = async (req, res, next) => {
  try {

    const result =
      await notificationService.markAllAsRead(
        req.user.id
      );

    res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    next(error);
  }
};