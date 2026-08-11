const express = require('express');

const router = express.Router();

const offerImagesController = require('../../controllers/offerImages.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');




router.get(
  '/',

      authMiddleware,
  
    authorizeRoles('admin'),

  offerImagesController.getAllOfferImages
);


router.delete(
  '/:id',

      authMiddleware,
  
    authorizeRoles('admin'),

  offerImagesController.deleteOfferImage
);





module.exports = router;