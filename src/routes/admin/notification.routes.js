const express = require('express');

const router = express.Router();

const notificationController =
  require('../../controllers/notification.controller');



  const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');


router.get(
  '/',
  authMiddleware,
  authorizeRoles('admin'),
  notificationController.getNotifications
);


router.get(
  '/unread-count',
  authMiddleware,
  authorizeRoles('admin'),
    notificationController.getUnreadCount
);


router.patch(
  '/read-all',
authMiddleware,
  authorizeRoles('admin'),
  notificationController.markAllAsRead
);


router.patch(
  '/:id/read',
    authMiddleware,
  authorizeRoles('admin'),
  notificationController.markAsRead
);


module.exports = router;