const analysisService =
  require('../services/analysis.service');


 exports.getAnalysis =
async (req, res, next) => {

  try {

    const {
      year,
      month,
    } = req.query;


    const data =
      await analysisService.getAnalysis({

        year,
        month,

      });


    res.status(200).json({

      success: true,

      data,

    });

  } catch (error) {

    next(error);

  }

};