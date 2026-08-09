const ratingService = require('../services/process_rating.service');


// ==========================================
// CREATE RATING
// ==========================================

exports.createRating = async (req, res, next) => {

  try {

    const rating = await ratingService.createRating(
      req.body,
      req.user.id
    );

    res.status(201).json({

      success: true,

      message: 'Rating created successfully',

      data: rating,

    });

  } catch (error) {

    next(error);

  }

};


// ==========================================
// GET MY RATINGS
// ==========================================

exports.getMyRatings = async (req, res, next) => {

  try {

    const ratings =
      await ratingService.getMyRatings(
        req.user.id
      );

    res.status(200).json({

      success: true,

      data: ratings,

    });

  } catch (error) {

    next(error);

  }

};


// ==========================================
// GET RATING BY ID
// ==========================================

exports.getRatingById = async (req, res, next) => {

  try {

    const rating =
      await ratingService.getRatingById(
        req.params.id
      );

    res.status(200).json({

      success: true,

      data: rating,

    });

  } catch (error) {

    next(error);

  }

};


// ==========================================
// GET ALL RATINGS - ADMIN
// ==========================================

exports.getRatings = async (req, res, next) => {

  try {

    const {
      page = 1,
      limit = 10,
      search,
      rating,
      purchase_id,
      sale_id,
    } = req.query;
    

    const result =
      await ratingService.getRatings({

        page,
        limit,
        search,
        rating,
        purchase_id,
        sale_id,

      });

    res.status(200).json({

      success: true,

      data: result,

    });

  } catch (error) {

    next(error);

  }

};


// ==========================================
// GET AVERAGE RATING - ADMIN
// ==========================================

exports.getAverageRating = async (req, res, next) => {

  try {

    const result =
      await ratingService.getAverageRating();

    res.status(200).json({

      success: true,

      data: result,

    });

  } catch (error) {

    next(error);

  }

};


// ==========================================
// GET RATING STATISTICS - ADMIN
// ==========================================

exports.getRatingStatistics = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await ratingService.getRatingStatistics();

    res.status(200).json({

      success: true,

      data: result,

    });

  } catch (error) {

    next(error);

  }

};






exports.deleteRate = async (req, res) => {


    await ratingService.deleteRate(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Rate deleted successfully',
    });

};
