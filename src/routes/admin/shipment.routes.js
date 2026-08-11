const express = require('express');

const router = express.Router();

const controller =
  require('../../controllers/shipment.controller');

const authMiddleware =
  require('../../middlewares/auth.middleware');

const authorizeRoles =
  require('../../middlewares/role.middleware');

const validate =
  require('../../middlewares/validation.middleware');

const {
  createShipmentSchema,
} =
require('../../validations/shipment.validation');

router.post(
  '/',

     authMiddleware,
  
    authorizeRoles('admin'),

  controller.createShipment
);

router.get(
  '/',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.getShipments
);

router.get(
  '/:id',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.getShipmentById
);




router.patch(
  '/:id/status',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.updateShipmentStatus
);



module.exports = router;