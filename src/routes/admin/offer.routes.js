const express = require('express');

const router = express.Router();

const offerController = require('../../controllers/offer.controller');

const authMiddleware = require('../../middlewares/auth.middleware');



router.get(
  '/',

  offerController.getAllOffers
);





router.patch(
  '/:id/approve',

  // authMiddleware,

  // authorizeRoles('admin'),

  offerController.approveOffer
);



router.patch(
  '/:id/reject',

  // authMiddleware,

  // authorizeRoles('admin'),

  offerController.rejectOffer
);



router.delete(
  '/:id',

  // authMiddleware,

  // authorizeRoles('farmer'),

  offerController.deleteOffer
);



module.exports = router;