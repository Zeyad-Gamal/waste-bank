const express = require('express');

const router = express.Router();

const controller =
  require('../controllers/inventory.controller');

const authMiddleware =
  require('../middlewares/auth.middleware');

const authorizeRoles =
  require('../middlewares/role.middleware');

router.get(
  '/',

  authMiddleware,

  authorizeRoles('admin'),

  controller.getInventory
);

router.get(
  '/:id',

  authMiddleware,

  authorizeRoles('admin'),

  controller.getInventoryItem
);

router.patch(
  '/:id',

  authMiddleware,

  authorizeRoles('admin'),

  controller.updateInventory
);

module.exports = router;