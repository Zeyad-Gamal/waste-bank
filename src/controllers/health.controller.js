const service = require('../services/health.service');
const asyncHandler = require('../middlewares/async-handler.middleware');

exports.getHealth = asyncHandler(async (req, res) => {


    const result =
      await service.getHealth();

      
    res.status(200).json({
      result
    });

}
);

