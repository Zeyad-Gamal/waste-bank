const factoryService = require('../services/factory.service');
const asyncHandler = require('../middlewares/async-handler.middleware');





exports.getAllFactories = asyncHandler(async (req, res) => {



    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.search || '';
    const activation = req.query.activation;
    const industry_type = req.query.industryType;



    const result =
      await factoryService.getAllFactories(
        page,
        limit,
        search,
        activation,
        industry_type
      );

      
    res.status(200).json({
      success: true,
      data: result,
    });

}
);


exports.addFactory = asyncHandler(async (req, res) => {

    const factoryData = {

      ...req.body,

      factory_image:
        req.files?.factory_image?.[0]?.path || null,

    };

    const result = await factoryService.addFactory(factoryData);

    res.status(201).json({
      success: true,
      message: 'Factory registered successfully',
      data: result,
    });

} 
);


exports.updateFactoryStatus = asyncHandler(async (req, res) => {


  var activation = '';

  if(req.body.status == true){
    activation = 'active';
  }
  else if(req.body.status == false){
    activation = 'inactive';
  }


    const result =
      await factoryService.updateFactoryStatus(
        req.params.id,
        activation
      );

    res.status(200).json({
      success: true,
      message: 'status updated',
      data: result,
    });

}
);

exports.deleteFactory = asyncHandler(async (req, res) => {

    
    await factoryService.deleteFactory(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Factory deleted successfully',
    });

}
);