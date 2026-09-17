const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const upload = require('../utils/multer');

const {
  updatePasswordSchema,
} = require('../validations/user.validation');


router.post(
  '/register/farmer',

  upload.fields([
    { name: 'national_id_image', maxCount: 1 },
    { name: 'proof_image', maxCount: 1 },
  ]),
  authController.registerFarmer
);


router.post(
  '/register/factory',

  upload.fields([
    { name: 'factory_image', maxCount: 1 },
  ]),

  authController.registerFactory
);

router.post('/login', authController.login);


router.get(
  
  '/me', 
  
    authMiddleware,

    authorizeRoles('farmer','factory'),
  
  authController.me

);


router.patch(
  '/update-password',
  authMiddleware,
    authorizeRoles('factory','farmer'),
  validate(updatePasswordSchema),
  authController.updatePassword
);




router.get(
  '/verify-email',
  authController.verifyEmail
);


router.post(
  '/resend-verification',
  authController.resendVerificationEmail
);



module.exports = router;