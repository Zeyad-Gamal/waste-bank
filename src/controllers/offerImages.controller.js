const offerImageService = require('../services/offerImages.service');
const asyncHandler = require('../middlewares/async-handler.middleware');




exports.getAllOfferImages = asyncHandler(async (req, res) => {



    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;


    const search = req.query.search || '';
    

    const result =
      await offerImageService.getAllOfferImages(
        page,
        limit,
        search
      );

    res.status(200).json({
      success: true,
      data: result,
    });

}
);



exports.deleteOfferImage = asyncHandler(async (req, res) => {


    await offerImageService.deleteOfferImage(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });

}
);