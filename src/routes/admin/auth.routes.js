const express = require('express');

const router = express.Router();

const authController = require('../../controllers/auth.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const upload = require('../../utils/multer');



router.post('/login', authController.adminLogin);


router.get(
  
  '/me', 
  
    authMiddleware,

    authorizeRoles('admin'),
  
  authController.me

);



router.get(
  '/verify-email',
  authController.verifyEmail
);

module.exports = router;