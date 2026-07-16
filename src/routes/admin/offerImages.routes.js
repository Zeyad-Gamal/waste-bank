const express = require('express');

const router = express.Router();

const offerImagesController = require('../../controllers/offerImages.controller');

const authMiddleware = require('../../middlewares/auth.middleware');





router.get(
  '/',

  offerImagesController.getAllOfferImages
);


router.delete(
  '/:id',

  offerImagesController.deleteOfferImage
);





module.exports = router;