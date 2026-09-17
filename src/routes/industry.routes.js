const express = require('express');

const router = express.Router();

const controller =
  require('../controllers/industry.controller');

const authMiddleware =
  require('../middlewares/auth.middleware');

const authorizeRoles =
  require('../middlewares/role.middleware');

const validate =
  require('../middlewares/validation.middleware');




router.get(
  '/',

  // authMiddleware,

  // authorizeRoles('factory'),

  controller.getAll
);


module.exports = router;