const { Notification } = require('../models');
const AppError = require('../utils/app-error');


/**
 * Create a notification for a user
 */
exports.createNotification = async ({
  userId,
  type,
  title,
  message,
  data = null,
}) => {

  if (!userId) {
    throw new AppError('User ID is required', 400);
  }

  if (!type) {
    throw new AppError('Notification type is required', 400);
  }

  if (!title) {
    throw new AppError('Notification title is required', 400);
  }

  if (!message) {
    throw new AppError('Notification message is required', 400);
  }

  return await Notification.create({
    user_id: userId,
    type,
    title,
    message,
    data,
  });
};


/**
 * Get notifications for a user
 */
exports.getUserNotifications = async (
  userId,
  options = {}
) => {

  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
  } = options;

  const offset = (page - 1) * limit;

  const where = {
    user_id: userId,
  };

  if (unreadOnly) {
    where.is_read = false;
  }

  const { count, rows } =
    await Notification.findAndCountAll({
      where,

      order: [
        ['created_at', 'DESC'],
      ],

      limit: Number(limit),
      offset,

    });

  return {
    notifications: rows,

    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(count / limit),
    },
  };
};


/**
 * Get unread notifications count
 */
exports.getUnreadCount = async (userId) => {

  return await Notification.count({
    where: {
      user_id: userId,
      is_read: false,
    },
  });

};


/**
 * Mark one notification as read
 */
exports.markAsRead = async (
  notificationId,
  userId
) => {

  const notification =
    await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });

  if (!notification) {
    throw new AppError(
      'Notification not found',
      404
    );
  }

  if (!notification.is_read) {

    await notification.update({
      is_read: true,
      read_at: new Date(),
    });

  }

  return notification;
};


/**
 * Mark all notifications as read
 */
exports.markAllAsRead = async (userId) => {

  await Notification.update(
    {
      is_read: true,
      read_at: new Date(),
    },
    {
      where: {
        user_id: userId,
        is_read: false,
      },
    }
  );

  return {
    message: 'All notifications marked as read',
  };
};





exports.notifyAdmins = async ({
  type,
  title,
  message,
  data = null,
}) => {

  const { User } = require('../models');

  const admins = await User.findAll({
    where: {
      role: 'admin',
      is_active: 'active',
    },
    attributes: ['id'],
  });

  if (!admins.length) {
    return [];
  }

  const notifications = admins.map((admin) => ({
    user_id: admin.id,
    type,
    title,
    message,
    data,
  }));

  return await Notification.bulkCreate(
    notifications
  );
};