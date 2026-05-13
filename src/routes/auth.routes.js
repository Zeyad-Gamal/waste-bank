const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post('/register/farmer', authController.registerFarmer);

router.post('/register/factory', authController.registerFactory);

router.post('/login', authController.login);

module.exports = router;