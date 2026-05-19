const express = require('express');

const router = express.Router();

const controller =
  require('../controllers/sale.controller');

const authMiddleware =
  require('../middlewares/auth.middleware');

const authorizeRoles =
  require('../middlewares/role.middleware');

const validate =
  require('../middlewares/validation.middleware');

const {
  createSaleSchema,
} =
require('../validations/sale.validation');

router.post(
  '/',

  authMiddleware,

  authorizeRoles('admin'),

  validate(
    createSaleSchema
  ),

  controller.createSale
);

router.get(
  '/',

  authMiddleware,

  authorizeRoles('admin'),

  controller.getSales
);

router.get(
  '/my-sales',

  authMiddleware,

  authorizeRoles('factory'),

  controller.getFactorySales
);

router.patch(
  '/:id/status',

  authMiddleware,

  authorizeRoles('admin'),

  controller.updateStatus
);

module.exports = router;