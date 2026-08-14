const express = require('express');

const router = express.Router();

const controller =
  require('../../controllers/sale.controller');

const authMiddleware =
  require('../../middlewares/auth.middleware');

const authorizeRoles =
  require('../../middlewares/role.middleware');

const validate =
  require('../../middlewares/validation.middleware');

const {
  createSaleSchema,
} =
require('../../validations/sale.validation');

router.post(
  '/',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.createSale
);

router.get(
  '/',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.getSales
);

router.get(
  '/my-sales',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.getFactorySales
);


router.get(
  '/items',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.getSaleItems
);





router.patch(
  '/:id/approve',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.approveSale
);




router.patch(
  '/:id/reject',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.rejectSale
);




router.patch(
  '/:id/complete',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.completeSale
);



router.put(
  '/:id',

      authMiddleware,
  
    authorizeRoles('admin'),

  controller.updateSale
);


module.exports = router;