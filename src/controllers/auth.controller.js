const authService = require('../services/auth.service');

exports.registerFarmer = async (req, res) => {

  try {

    const result = await authService.registerFarmer(req.body);

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: result,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

exports.registerFactory = async (req, res) => {

  try {

    const result = await authService.registerFactory(req.body);

    res.status(201).json({
      success: true,
      message: 'Factory registered successfully',
      data: result,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

exports.login = async (req, res) => {

  try {

    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });

  } catch (error) {

    res.status(401).json({
      success: false,
      message: error.message,
    });

  }

};