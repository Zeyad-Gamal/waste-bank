const express = require('express');

const router = express.Router();

const offerController = require('../../controllers/offer.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const validate = require('../../middlewares/validation.middleware');

const upload = require('../../utils/multer');


const {
  createOfferSchema,
} = require('../../validations/offer.validation');

const {
  updateOfferSchema,
} = require('../../validations/offer.validation');



router.post(
  '/',

  authMiddleware,
  
  authorizeRoles('admin'),

  upload.array('offer_images', 10),


  offerController.createOffer
);


router.get(
  '/',

  authMiddleware,
  
  authorizeRoles('admin'),

  offerController.getAllOffers
);





router.patch(
  '/:id/approve',

  authMiddleware,
  
  authorizeRoles('admin'),

  offerController.approveOffer
);



router.patch(
  '/:id/reject',

  authMiddleware,
  
  authorizeRoles('admin'),

  offerController.rejectOffer
);



router.delete(
  '/:id',

  authMiddleware,
  
  authorizeRoles('admin'),

  offerController.deleteOffer
);



module.exports = router;