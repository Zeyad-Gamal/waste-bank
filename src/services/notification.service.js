const { Notification } = require('../models');
const AppError = require('../utils/app-error');

const ERROR_MESSAGES = require('../constants/error-messages');

const SUCCESS_MESSAGES = require('../constants/success-messages');

const notificationSocket = require('./notification.socket');
const {
  emitToUser,
} = require('./notification.socket');

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



  const notification = await Notification.create({
    user_id: userId,
    type,
    title,
    message,
    data,
  });

    notificationSocket.emitToUser(
    userId,
    notification
  );


  return notification;


  
};


/**
 * Get notifications for a user
 */
exports.getUserNotifications = async (
  userId,
  options = {}
) => {

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 20;

  const offset = (page - 1) * limit;

  const { count, rows } =
    await Notification.findAndCountAll({

      where: {
        user_id: userId,
      },

      order: [
        ['created_at', 'DESC'],
      ],

      limit,
      offset,

    });

  return {
    notifications: rows,

    pagination: {
      page,
      limit,
      total: count,
      total_pages:
        Math.ceil(count / limit),
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
      ERROR_MESSAGES.NOTIFICATION_NOT_FOUND,
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
    message: SUCCESS_MESSAGES.ALL_NOTIFICATIONS_READ,
  };
};





exports.notifyAdmins = async ({
  type,
  title,
  message,
  data = null,
}) => {

  const { User } =
    require('../models');


  const admins =
    await User.findAll({
      where: {
        role: 'admin',
        is_active: 'active',
      },
      attributes: ['id'],
    });


  if (!admins.length) {
    return [];
  }


  const notifications =
    admins.map((admin) => ({
      user_id: admin.id,
      type,
      title,
      message,
      data,
    }));


  const createdNotifications =
    await Notification.bulkCreate(
      notifications
    );


  // Send real-time notifications
  createdNotifications.forEach(
    (notification) => {

      emitToUser(
        notification.user_id,
        notification
      );

    }
  );


  return createdNotifications;
};