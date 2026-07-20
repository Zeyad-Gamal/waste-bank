const express = require('express');

const router = express.Router();

const inventoryController = require('../../controllers/inventory.controller');

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




router.get(
    '/',
    
    // authMiddleware,
    
    inventoryController.getInventory
);



// router.post(
//   '/',

//   purchaseController.createPurchase
// );



// router.patch(
//   '/:id/approve',



//   purchaseController.approvePurchase
// );


// router.patch(
//   '/:id/reject',



//   purchaseController.rejectPurchase
// );



// router.patch(
//   '/:id/complete',



//   purchaseController.completePurchase
// );



// // router.delete(
// //   '/:id',

// //   farmerController.deleteFarmer
// // );





module.exports = router;