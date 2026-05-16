const express = require('express');

const router = express.Router();

const controller =
  require('../controllers/purchase.controller');

const authMiddleware =
  require('../middlewares/auth.middleware');

const authorizeRoles =
  require('../middlewares/role.middleware');

const validate =
  require('../middlewares/validation.middleware');

const {
  createPurchaseSchema,
} = require('../validations/purchase.validation');

router.post(
  '/',

  authMiddleware,

  authorizeRoles('admin'),

  validate(createPurchaseSchema),

  controller.createPurchase
);

router.get(
  '/',

  authMiddleware,

  authorizeRoles('admin'),

  controller.getAllPurchases
);

router.get(
  '/my-purchases',

  authMiddleware,

  authorizeRoles('farmer'),

  controller.getMyPurchases
);

router.patch(
  '/:id/status',

  authMiddleware,

  authorizeRoles('admin'),

  controller.updatePurchaseStatus
);

module.exports = router;