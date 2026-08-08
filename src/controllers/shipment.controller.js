const service = require('../services/shipment.service');
const asyncHandler = require('../middlewares/async-handler.middleware');

exports.createShipment = asyncHandler( async (req, res) => {

    
    const result = await service.createShipment(req.body);

    res.status(201).json({
      success: true,
      data: result
    });

});

exports.getShipments = asyncHandler(async (req, res) => {

  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 10;
  
  const search = req.query.search || '';


    const status = req.query.status || '';
    
    const type = req.query.type || '';


  const result = await service.getShipments(
    page,
    limit,
    search,
    type,
    status
  );

  res.json({
    success: true,
    data: result
  });
});

exports.updateShipmentStatus = asyncHandler(async (req, res) => {
  const result = await service.updateShipmentStatus(
    req.params.id,
    req.body.status
  );

  res.json({
    success: true,
    data: result
  });
});


exports.getShipmentById = asyncHandler(async (req, res) => {



    const result = await service.getShipmentById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: result,
    });

});