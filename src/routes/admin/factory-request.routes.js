const express = require('express');

const router = express.Router();

const factoryRequestController = require('../../controllers/factory-request.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const validate = require('../../middlewares/validation.middleware');

const upload = require('../../utils/multer');





router.get(
    '/',
    
    authMiddleware,
  
    authorizeRoles('admin'),
    
    factoryRequestController.getAllRequests
);



router.patch(
    '/:id/status',
    
    authMiddleware,
  
    authorizeRoles('admin'),
    
    factoryRequestController.updateRequestStatus
);



router.patch(
    '/:id/cancel',
    
    authMiddleware,
  
    authorizeRoles('admin'),
    
    factoryRequestController.adminCancelFactoryRequest
);




module.exports = router;