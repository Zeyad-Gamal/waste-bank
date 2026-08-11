const express = require('express');

const router = express.Router();

const unitController = require('../../controllers/unit.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const validate = require('../../middlewares/validation.middleware');




router.post(
  '/',

      authMiddleware,
  
    authorizeRoles('admin'),

  unitController.createUnit
);





router.put(
  '/:id',

      authMiddleware,
  
    authorizeRoles('admin'),

  unitController.updateUnit
);




router.get(
  '/',

      authMiddleware,
  
    authorizeRoles('admin'),

  unitController.getAllOffers
);





module.exports = router;