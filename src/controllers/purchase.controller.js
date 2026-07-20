const service =
  require('../services/purchase.service');
  const asyncHandler = require('../middlewares/async-handler.middleware');

exports.createPurchase = asyncHandler(async (req, res) => {



      const result =
        await service.createPurchase(
          req.body
        );

      res.status(201).json({
        success: true,
        message:
          'Purchase created successfully',
        data: result,
      });

});

exports.getAllPurchases = asyncHandler(async (req, res) => {

      const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;


    const search = req.query.search || '';
    const status = req.query.status;


      const result =
        await service.getAllPurchases(
          page,
          limit,
          search,
          status
        );

      res.status(200).json({
        success: true,
        data: result,
      });

});

exports.getMyPurchases = asyncHandler(async (req, res) => {



      const result =
        await service.getMyPurchases(
          req.user.id
        );

      res.status(200).json({
        success: true,
        data: result,
      });

});

exports.updatePurchaseStatus = asyncHandler(async (req, res) => {

      const result =
        await service.updatePurchaseStatus(

          req.params.id,

          req.body.status

        );

      res.status(200).json({
        success: true,
        message:
          'Purchase status updated successfully',
        data: result,
      });

});





exports.approvePurchase = asyncHandler(async (req, res) => {

      const result =
        await service.approvePurchase(

          req.params.id,
        );

      res.status(200).json({
        success: true,
        message:
          'Purchase approved successfully',
        data: result,
      });

});




exports.rejectPurchase = asyncHandler(async (req, res) => {

      const result =
        await service.rejectPurchase(

          req.params.id,

          // req.body.status

        );

      res.status(200).json({
        success: true,
        message:
          'Purchase rejected successfully',
        data: result,
      });

});



exports.completePurchase = asyncHandler(async (req, res) => {

      const result =
        await service.completePurchase(

          req.params.id,

        );

      res.status(200).json({
        success: true,
        message:
          'Purchase completed successfully',
        data: result,
      });

});