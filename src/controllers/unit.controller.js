const unitService = require('../services/unit.service');
const asyncHandler = require('../middlewares/async-handler.middleware');


exports.createUnit = asyncHandler(async (req, res) => {




    const result = await unitService.createUnit({

      ...req.body,
    
    });

    res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      data: result,
    });

}
);





exports.updateUnit = asyncHandler(async (req, res) => {



    const result = await unitService.updateUnit(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Unit updated successfully',
      data: result,
    });
}
);





exports.getAllOffers = asyncHandler(async (req, res) => {




    const result =
      await unitService.getAllUnits();

    res.status(200).json({
      success: true,
      data: result,
    });

}
);

