const service =
  require('../services/industries.service');
  const asyncHandler = require('../middlewares/async-handler.middleware');



exports.getAll = asyncHandler(async (req, res) => {


    const result =
      await service.getAllIndustries();

    res.status(200).json({
      success: true,
      data: result,
    });



}
);



