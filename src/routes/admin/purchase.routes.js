const express = require('express');

const router = express.Router();

const purchaseController = require('../../controllers/purchase.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const validate = require('../../middlewares/validation.middleware');

const upload = require('../../utils/multer');



const {
  createPurchaseSchema,
} = require('../../validations/purchase.validation');




router.get(
    '/',
    
    authMiddleware,
  
    authorizeRoles('admin'),
    
    purchaseController.getAllPurchases
);



router.post(
  '/',

  authMiddleware,
  authorizeRoles('admin'),
  validate(createPurchaseSchema),
  purchaseController.createPurchase
);



router.patch(
  '/:id/approve',

      authMiddleware,
  
    authorizeRoles('admin'),

  purchaseController.approvePurchase
);


router.patch(
  '/:id/reject',

      authMiddleware,
  
    authorizeRoles('admin'),

  purchaseController.rejectPurchase
);



router.patch(
  '/:id/complete',

      authMiddleware,
  
    authorizeRoles('admin'),

  purchaseController.completePurchase
);







module.exports = router;