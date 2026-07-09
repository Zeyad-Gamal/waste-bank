const farmerService = require('../services/farmer.service');
const asyncHandler = require('../middlewares/async-handler.middleware');





exports.getAllFactories = asyncHandler(async (req, res) => {



    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

 const search = req.query.search || '';
 const activation = req.query.activation;
 const landType = req.query.landType;



    const result =
      await farmerService.getAllFarmers(
        page,
        limit,
        search,
        activation,
        landType
      );

      
    res.status(200).json({
      success: true,
      data: result,
    });

}
);


// exports.addFarmer = asyncHandler(async (req, res) => {

//     const farmerData = {

//       ...req.body,

//       national_id_image:
//         req.files?.national_id_image?.[0]?.path || null,

//       proof_image:
//         req.files?.proof_image?.[0]?.path || null,

//     };

//     const result = await farmerService.addFarmer(farmerData);

//     res.status(201).json({
//       success: true,
//       message: 'Farmer registered successfully',
//       data: result,
//     });

// } 
// );


// exports.updateFarmerStatus = asyncHandler(async (req, res) => {

//     console.log('farmer id:', req.params.id)
//   console.log('new status:', req.body.status)

//   var activation = '';

//   if(req.body.status == true){
//     activation = 'active';
//   }
//   else if(req.body.status == false){
//     activation = 'inactive';
//   }

//   console.log('new status:', activation)

//     const result =
//       await farmerService.updateFarmerStatus(
//         req.params.id,
//         activation
//       );

//     res.status(200).json({
//       success: true,
//       message: 'status updated',
//       data: result,
//     });

// }
// );