const router = require('express').Router();

const controller = require('../controllers/shipment.controller');

const auth = require('../middlewares/auth.middleware');

const role = require('../middlewares/role.middleware');

const validate = require('../middlewares/validation.middleware');


router.get(
    '/my',
    auth,
    role('factory'),
    controller.getUserShipments
);


module.exports = router;