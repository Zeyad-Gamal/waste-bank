const { Farmer, User, sequelize } = require('../models');
const AppError = require( '../utils/app-error');



exports.getAllFarmers = async (
  page,
  limit
) => {

  const offset = (page - 1) * limit;

  const { count, rows } =
    await Farmer.findAndCountAll({

        attributes: {
    exclude: [ 'created_at', 'updated_at', 'id']
  },

      include: [
        {
          model: User,
          as: 'user',
          attributes: {
                exclude: ['password', 'created_at', 'updated_at', 'id']
            },
        }
      ],

      order: [
        ['created_at', 'DESC']
      ],

      limit,

      offset,

    distinct: true,

    });

  return {

    total: count,

    current_page: page,

    total_pages: Math.ceil(count / limit),

    farmers: rows,

  };

};

