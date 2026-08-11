const express = require('express');

const router = express.Router();

const farmerController = require('../../controllers/farmer.controller');

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
    
    authMiddleware,

    authorizeRoles('admin'),
    
    farmerController.getAllFarmers
);



router.post(
  '/',

  authMiddleware,
  
  authorizeRoles('admin'),

  upload.fields([
    { name: 'national_id_image', maxCount: 1 },
    { name: 'proof_image', maxCount: 1 },
  ]),
  farmerController.addFarmer
);



router.patch(
  '/:id/status',

  authMiddleware,
  
  authorizeRoles('admin'),

  farmerController.updateFarmerStatus
);



router.delete(
  '/:id',

  authMiddleware,
  
  authorizeRoles('admin'),

  farmerController.deleteFarmer
);





module.exports = router;