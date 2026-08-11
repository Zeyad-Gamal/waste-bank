const express = require('express');

const router = express.Router();

const ratingController = require('../../controllers/process_rating.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const validate = require('../../middlewares/validation.middleware');

const upload = require('../../utils/multer');


const {
 createProcessRatingSchema,
} = require('../../validations/process-rating.validation');





router.get(
  '/',

      authMiddleware,
  
    authorizeRoles('admin'),

  ratingController.getRatings
);


router.get(
  '/average',

      authMiddleware,
  
    authorizeRoles('admin'),

  ratingController.getAverageRating
);


router.delete(
  '/:id',

      authMiddleware,
  
    authorizeRoles('admin'),


  ratingController.deleteRate
);





module.exports = router;