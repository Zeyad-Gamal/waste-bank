'use strict';

const dashboardService =
  require('../services/admin-dashboard.service');



exports.getDashboard =
async (req, res, next) => {

  try {

    const data =
      await dashboardService.getDashboard();

    return res.status(200).json({

      success: true,

      data,

    });

  } catch (error) {

    next(error);

  }

};