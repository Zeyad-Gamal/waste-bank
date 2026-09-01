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




router.get(
  '/my-purchases',

  authMiddleware,

  authorizeRoles('farmer'),

  controller.getMyPurchases
);


module.exports = router;