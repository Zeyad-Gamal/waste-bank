const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

const upload = require('../utils/multer');


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
  '/verify-email',
  authController.verifyEmail
);


router.post(
  '/resend-verification',
  authController.resendVerificationEmail
);



module.exports = router;