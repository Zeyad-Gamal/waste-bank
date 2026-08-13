const express = require('express');

const router = express.Router();

const notificationController =
  require('../controllers/notification.controller');



  const authMiddleware = require('../middlewares/auth.middleware');

const authorizeRoles = require('../middlewares/role.middleware');


router.get(
  '/',
  authMiddleware,
  authorizeRoles('farmer','factory'),
  notificationController.getNotifications
);


router.get(
  '/unread-count',
  authMiddleware,
  authorizeRoles('farmer','factory'),
    notificationController.getUnreadCount
);


router.patch(
  '/read-all',
authMiddleware,
  authorizeRoles('farmer','factory'),
  notificationController.markAllAsRead
);


router.patch(
  '/:id/read',
    authMiddleware,
  authorizeRoles('farmer','factory'),
  notificationController.markAsRead
);


module.exports = router;