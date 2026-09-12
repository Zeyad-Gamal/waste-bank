const express = require('express');

const router = express.Router();

const controller = require('../controllers/health.controller');






router.get(
  '/',

  controller.getHealth
);





module.exports = router;