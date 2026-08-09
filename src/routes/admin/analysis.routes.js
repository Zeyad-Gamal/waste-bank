const express = require('express');

const router = express.Router();

const auth =
  require('../../middlewares/auth.middleware');

const authorizeRoles =
  require('../../middlewares/role.middleware');

const controller =
  require('../../controllers/analysis.controller');


router.get(
  '/',
//   auth,
//   authorizeRoles('admin'),
  controller.getAnalysis
);


module.exports = router;