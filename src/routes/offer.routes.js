const express = require('express');

const router = express.Router();

const offerController = require('../controllers/offer.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const authorizeRoles = require('../middlewares/role.middleware');

const validate = require('../middlewares/validation.middleware');

const upload = require('../utils/multer');



const {
  createOfferSchema,
} = require('../validations/offer.validation');

const {
  updateOfferSchema,
} = require('../validations/offer.validation');


router.post(
  '/',

  // authMiddleware,

  // authorizeRoles('farmer'),

  upload.array('offer_images', 10),

  validate(createOfferSchema),

  offerController.createOffer
);




router.put(
  '/:id',

  authMiddleware,

  authorizeRoles('farmer'),
  
  upload.none(),

  validate(updateOfferSchema),

  offerController.updateOffer
);


router.get(
  '/my-offers',

  authMiddleware,

  authorizeRoles('farmer'),

  offerController.getMyOffers
);





router.get(
  '/:id',

  authMiddleware,

  offerController.getOfferById
);


router.get(
    '/',
    
    authMiddleware,
    
    offerController.getAllOffers
);







module.exports = router;