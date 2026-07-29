const express = require('express');

const router = express.Router();

const unitController = require('../../controllers/unit.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const validate = require('../../middlewares/validation.middleware');




router.post(
  '/',



  unitController.createUnit
);





router.put(
  '/:id',


  unitController.updateUnit
);




router.get(
  '/',


  unitController.getAllOffers
);





module.exports = router;