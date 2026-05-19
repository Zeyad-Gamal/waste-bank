const service = require('../services/shipment.service');

exports.createShipment = async (req, res) => {
  try {
    const result = await service.createShipment(req.body);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getShipments = async (req, res) => {
  const result = await service.getShipments();

  res.json({
    success: true,
    data: result
  });
};

exports.updateShipmentStatus = async (req, res) => {
  const result = await service.updateShipmentStatus(
    req.params.id,
    req.body.status
  );

  res.json({
    success: true,
    data: result
  });
};