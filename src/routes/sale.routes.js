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



router.get(
  '/my-sales',

  authMiddleware,

  authorizeRoles('factory'),

  controller.getFactorySales
);



module.exports = router;