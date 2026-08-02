const service = require('../services/sale.service');
const asyncHandler = require('../middlewares/async-handler.middleware');

exports.createSale = asyncHandler(async (req, res) => {
    const result = await service.createSale(req.body);

    res.status(201).json({
      success: true,
      data: result
    });

});

exports.getSales = asyncHandler(async (req, res) => {


  const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;


    const search = req.query.search || '';


  const result = await service.getSales(page, limit, search);

  res.json({
    success: true,
    total: result.count,
    page,
    data: result.rows
  });
});

exports.getFactorySales = asyncHandler(async (req, res) => {
  const result = await service.getFactorySales(req.user.id);

  res.json({
    success: true,
    data: result
  });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const result = await service.updateStatus(
    req.params.id,
    req.body.status
  );

  res.json({
    success: true,
    data: result
  });
});


exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await service.updateSale(id, req.body);

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to update sale'
    });
  }
};