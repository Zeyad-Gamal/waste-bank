const express = require('express');

const router = express.Router();

const factoryController = require('../../controllers/factory.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const validate = require('../../middlewares/validation.middleware');

const upload = require('../../utils/multer');





router.get(
    '/',
    
    // authMiddleware,
    
    factoryController.getAllFactories
);



router.post(
  '/',

  upload.fields([
    { name: 'factory_image', maxCount: 1 },
  ]),
  factoryController.addFactory
);




router.patch(
  '/:id/status',

  factoryController.updateFactoryStatus
);





router.delete(
  '/:id',

  factoryController.deleteFactory
);



module.exports = router;