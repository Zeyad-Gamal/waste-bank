const router = require('express').Router();

const controller = require('../controllers/shipment.controller');

const auth = require('../middlewares/auth.middleware');

const role = require('../middlewares/role.middleware');

const validate = require('../middlewares/validation.middleware');

const {
  createShipmentSchema
} = require('../validations/shipment.validation');

router.post(
  '/',
  auth,
  role('admin'),
  validate(createShipmentSchema),
  controller.createShipment
);

router.get(
  '/',
  auth,
  controller.getShipments
);

router.patch(
  '/:id/status',
  auth,
  role('admin'),
  controller.updateShipmentStatus
);

module.exports = router;