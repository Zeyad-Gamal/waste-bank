const offerService = require('../services/offer.service');
const asyncHandler = require('../middlewares/async-handler.middleware');


exports.createOffer = asyncHandler(async (req, res) => {


    const imagePaths = req.files?.map(
      file => file.path
    ) || [];



    const result = await offerService.createOffer({

      ...req.body,

      farmer_id: req.user.id,

      images: imagePaths,

    });

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: result,
    });

}
);

exports.updateOffer = asyncHandler(async (req, res) => {



    const result = await offerService.updateOffer(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: result,
    });
}
);


exports.getMyOffers = asyncHandler(async (req, res) => {


    const result = await offerService.getMyOffers(
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: result,
    });

}
);

exports.deleteOffer = asyncHandler(async (req, res) => {


    await offerService.deleteOffer(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully',
    });

}
);


exports.getOfferById = asyncHandler(async (req, res) => {



    const result = await offerService.getOfferById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: result,
    });

}
);


exports.getApprovedOffers = asyncHandler(async (req, res) => {



    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const result =
      await offerService.getApprovedOffers(
        page,
        limit
      );

    res.status(200).json({
      success: true,
      data: result,
    });

}
);



exports.approveOffer = asyncHandler(async (req, res) => {



    const result =
      await offerService.approveOffer(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: 'Offer approved successfully',
      data: result,
    });

}
);


exports.rejectOffer = asyncHandler(async (req, res) => {


    const result =
      await offerService.rejectOffer(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: 'Offer rejected successfully',
      data: result,
    });

}
);



exports.getAllOffers = asyncHandler(async (req, res) => {



    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;


    const search = req.query.search || '';
    const status = req.query.status;



    const result =
      await offerService.getAllOffers(
        page,
        limit,
        search,
        status
      );

    res.status(200).json({
      success: true,
      data: result,
    });

}
);






