const authService = require('../services/auth.service');
const asyncHandler = require('../middlewares/async-handler.middleware');
const emailVerificationService = require('../services/email-verification.service');

exports.registerFarmer = asyncHandler(async (req, res) => {

    const farmerData = {

      ...req.body,

      national_id_image:
        req.files?.national_id_image?.[0]?.path || null,

      proof_image:
        req.files?.proof_image?.[0]?.path || null,

    };

    const result = await authService.registerFarmer(farmerData);

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: result,
    });

} 
);

exports.registerFactory = asyncHandler(async (req, res) => {
console.log('Factory registration data:', req.body);

    const factoryData = {

      ...req.body,

      factory_image:
        req.files?.factory_image?.[0]?.path || null,

    };

    const result = await authService.registerFactory(factoryData);

    res.status(201).json({
      success: true,
      message: 'Factory registered successfully',
      data: result,
    });



}
);

exports.login = asyncHandler( async (req, res) => {


    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });



}

);




exports.adminLogin = asyncHandler( async (req, res) => {


    const result = await authService.adminLogin(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });



}

);


exports.me = asyncHandler(async (req, res) => {


    const result = await authService.me(
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: result,
    });

}
);




exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const result =
      await emailVerificationService.verifyEmail(token);

    res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    next(error);
  }
};