const express = require('express');

const router = express.Router();

const farmerController = require('../../controllers/farmer.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const validate = require('../../middlewares/validation.middleware');

const upload = require('../../utils/multer');





router.get(
    '/',
    
    // authMiddleware,
    
    farmerController.getAllFarmers
);