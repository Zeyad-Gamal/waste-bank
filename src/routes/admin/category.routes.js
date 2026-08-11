const express = require('express');

const router = express.Router();

const categoryController = require('../../controllers/category.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorizeRoles = require('../../middlewares/role.middleware');

const validate = require('../../middlewares/validation.middleware');




router.post(
  '/',

  authMiddleware,
  
  authorizeRoles('admin'),

  categoryController.createCategory
);





router.put(
  '/:id',

  authMiddleware,
  
  authorizeRoles('admin'),

  categoryController.updateCategory
);




router.get(
  '/',

  authMiddleware,
  
  authorizeRoles('admin'),

  categoryController.getAllCategories
);





module.exports = router;