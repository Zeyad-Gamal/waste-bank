const express = require('express');

const router = express.Router();

const factoryController = require('../../controllers/factory.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const validate = require('../../middlewares/validation.middleware');

const upload = require('../../utils/multer');





router.get(
    '/',
    
    authMiddleware,
  
    authorizeRoles('admin'),
    
    factoryController.getAllFactories
);



router.post(
  '/',

  authMiddleware,
  
  authorizeRoles('admin'),

  upload.fields([
    { name: 'factory_image', maxCount: 1 },
  ]),
  factoryController.addFactory
);




router.patch(
  '/:id/status',

  authMiddleware,
  
  authorizeRoles('admin'),

  factoryController.updateFactoryStatus
);





router.delete(
  '/:id',

  authMiddleware,
  
  authorizeRoles('admin'),

  factoryController.deleteFactory
);



module.exports = router;