const categoryService = require('../services/categrory.service');
const asyncHandler = require('../middlewares/async-handler.middleware');


exports.createCategory = asyncHandler(async (req, res) => {




    const result = await categoryService.createCategory({

      ...req.body,
    
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: result,
    });

}
);




exports.updateCategory = asyncHandler(async (req, res) => {



    const result = await categoryService.updateCategory(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
}
);



exports.getAllCategories = asyncHandler(async (req, res) => {




    const result =
      await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: result,
    });

}
);
