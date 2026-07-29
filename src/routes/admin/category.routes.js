const express = require('express');

const router = express.Router();

const categoryController = require('../../controllers/category.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const validate = require('../../middlewares/validation.middleware');




router.post(
  '/',



  categoryController.createCategory
);





router.put(
  '/:id',


  categoryController.updateCategory
);




router.get(
  '/',


  categoryController.getAllCategories
);





module.exports = router;