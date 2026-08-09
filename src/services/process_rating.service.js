const { Op, Sequelize } = require('sequelize');

const {
  ProcessRating: Rating,
  User,
  Purchase,
  Sale,
} = require('../models');

const AppError = require('../utils/app-error');


// ==========================================
// CREATE RATING
// ==========================================

exports.createRating = async (data, userId) => {

  const where = {
    user_id: userId,
  };

  if (data.sale_id) {
    where.sale_id = data.sale_id;
  }

  if (data.purchase_id) {
    where.purchase_id = data.purchase_id;
  }

  const exists = await Rating.findOne({ where });

  if (exists) {
    throw new AppError(
      'Already rated',
      400
    );
  }

  return await Rating.create({

    user_id: userId,

    purchase_id: data.purchase_id,

    sale_id: data.sale_id,

    rating: data.rating,

    comment: data.comment,

  });

};


// ==========================================
// GET MY RATINGS
// ==========================================

exports.getMyRatings = async (userId) => {

  return await Rating.findAll({

    where: {
      user_id: userId,
    },

    include: [
      {
        model: Purchase,
        as: 'purchase',
      },
      {
        model: Sale,
        as: 'sale',
      },
    ],

    order: [
      ['created_at', 'DESC'],
    ],

  });

};


// ==========================================
// GET RATING BY ID
// ==========================================

exports.getRatingById = async (ratingId) => {

  const rating = await Rating.findByPk(
    ratingId,
    {
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'name',
            'role',
          ],
        },
        {
          model: Purchase,
          as: 'purchase',
        },
        {
          model: Sale,
          as: 'sale',
        },
      ],
    }
  );

  if (!rating) {

    throw new AppError(
      'Rating not found',
      404
    );

  }

  return rating;

};


// ==========================================
// GET ALL RATINGS - ADMIN
// ==========================================

exports.getRatings = async ({
  page = 1,
  limit = 10,
  search,
  rating,
  purchase_id,
  sale_id,
} = {}) => {

  const offset = (page - 1) * limit;

  const where = {};

  if (rating) {
    where.rating = rating;
  }

  if (purchase_id) {
    where.purchase_id = purchase_id;
  }

  if (sale_id) {
    where.sale_id = sale_id;
  }



  if (search) {
      where[Op.or] = [
        {
          sale_id: {
            [Op.like]: `%${search}%`,
          },
        },
        Sequelize.where(
          Sequelize.col('user.name'),
          {
            [Op.like]: `%${search}%`,
          }
        ),
      ];
    }

  const result = await Rating.findAndCountAll({

    where,

    include: [
      {
        model: User,
        as: 'user',
        attributes: [
          'id',
          'name',
          'role',
        ],
      },
      {
        model: Purchase,
        as: 'purchase',
      },
      {
        model: Sale,
        as: 'sale',
      },
    ],

    limit: Number(limit),

    offset,

    order: [
      ['created_at', 'DESC'],
    ],

  });

  return {

    total: result.count,

    current_page: Number(page),

    total_pages: Math.ceil(
      result.count / limit
    ),

    ratings: result.rows,

  };

};


// ==========================================
// GET AVERAGE RATING
// ==========================================

exports.getAverageRating = async () => {

  const result = await Rating.findOne({

    attributes: [

      [
        Rating.sequelize.fn(
          'AVG',
          Rating.sequelize.col('rating')
        ),
        'average_rating',
      ],

    ],

    raw: true,

  });

  return {

    average_rating:
      result?.average_rating
        ? Number(
            Number(
              result.average_rating
            ).toFixed(2)
          )
        : 0,

  };

};


// ==========================================
// GET RATING STATISTICS
// ==========================================

exports.getRatingStatistics = async () => {

  const ratings = await Rating.findAll({

    attributes: [

      'rating',

      [
        Rating.sequelize.fn(
          'COUNT',
          Rating.sequelize.col('rating')
        ),
        'count',
      ],

    ],

    group: ['rating'],

    order: [
      ['rating', 'ASC'],
    ],

    raw: true,

  });

  return ratings;

};









exports.deleteRate = async (
  Id,
) => {

   const rating = await Rating.findByPk(Id);

  if (!rating) {
    throw new AppError('Offer not found', 404);
  }


  await rating.destroy();

};