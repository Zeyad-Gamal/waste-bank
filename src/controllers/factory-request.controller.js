const service =
  require('../services/factory-request.service');
  const asyncHandler = require('../middlewares/async-handler.middleware');



exports.createFactoryRequest = asyncHandler(async (req, res) => {


      const result =
        await service.createFactoryRequest({

          ...req.body,

          factory_id: req.user.id,

        });

      res.status(201).json({
        success: true,
        message:
          'Factory request created successfully',
        data: result,
      });



}
);



exports.getMyRequests = asyncHandler(async (req, res) => {


    const result =
      await service.getMyRequests(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: result,
    });



}
);



exports.updateFactoryRequest = asyncHandler(async (req, res) => {


      const result =
        await service.updateFactoryRequest(

          req.params.id,

          req.user.id,

          req.body

        );

      res.status(200).json({
        success: true,
        message:
          'Factory request updated successfully',
        data: result,
      });



}
);


exports.cancelFactoryRequest = asyncHandler(async (req, res) => {

      const result =
        await service.cancelFactoryRequest(

          req.params.id,

          req.user.id

        );

      res.status(200).json({
        success: true,
        message:
          'Factory request cancelled successfully',
        data: result,
      });

}
);


exports.getAllRequests = asyncHandler(async (req, res) => {

  const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;


    const search = req.query.search || '';

    const status = req.query.status || '';



    const result =
      await service.getAllRequests(
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





exports.updateRequestStatus = asyncHandler(async (req, res) => {


      const result =
        await service.updateRequestStatus(

          req.params.id,
          req.body.status

        );

      res.status(200).json({
        success: true,
        message:
          'Factory request updated successfully',
        data: result,
      });



}
);





exports.adminCancelFactoryRequest = asyncHandler(async (req, res) => {

      const result =
        await service.adminCancelFactoryRequest(

          req.params.id,

        );

      res.status(200).json({
        success: true,
        message:
          'Factory request cancelled successfully',
        data: result,
      });

}
);