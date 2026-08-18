const express = require('express');

const router = express.Router();

const authController = require('../../controllers/auth.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const upload = require('../../utils/multer');


const validate =
  require('../../middlewares/validation.middleware');

const {
  updatePasswordSchema,
} = require('../../validations/user.validation');



router.post('/login', authController.adminLogin);


router.get(
  
  '/me', 
  
    authMiddleware,

    authorizeRoles('admin'),
  
  authController.me

);



router.patch(
  '/update-password',
  authMiddleware,
    authorizeRoles('admin'),
  validate(updatePasswordSchema),
  authController.updatePassword
);





module.exports = router;