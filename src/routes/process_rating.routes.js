const express = require('express');


const router = express.Router();

const controller =
  require('../controllers/process_rating.controller');

const authMiddleware =
  require('../middlewares/auth.middleware');

const authorizeRoles =
  require('../middlewares/role.middleware');

const validate =
  require('../middlewares/validation.middleware');

const {
  createProcessRatingSchema,
} = require('../validations/process-rating.validation');

router.post(
  '/',
  authMiddleware,
  authorizeRoles('farmer', 'factory'),
  validate(createProcessRatingSchema),
  controller.createRating
);


router.get(
  '/my-ratings',
  authMiddleware,
  authorizeRoles('farmer', 'factory'),
  controller.getMyRatings
);


router.get(
  '/',
  authMiddleware,
  authorizeRoles('admin'),
  controller.getRatings
);


module.exports = router;