const farmerService = require('../services/farmer.service');
const asyncHandler = require('../middlewares/async-handler.middleware');





exports.getAllFarmers = asyncHandler(async (req, res) => {



    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const result =
      await farmerService.getAllFarmers(
        page,
        limit
      );

    res.status(200).json({
      success: true,
      data: result,
    });

}
);
