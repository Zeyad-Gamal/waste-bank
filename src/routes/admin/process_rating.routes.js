const express = require('express');

const router = express.Router();

const ratingController = require('../../controllers/process_rating.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const validate = require('../../middlewares/validation.middleware');

const upload = require('../../utils/multer');


const {
 createProcessRatingSchema,
} = require('../../validations/process-rating.validation');





router.get(
  '/',

  ratingController.getRatings
);


router.get(
  '/average',

  ratingController.getAverageRating
);


router.delete(
  '/:id',


  ratingController.deleteRate
);





module.exports = router;