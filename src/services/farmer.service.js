const { Farmer, User, sequelize } = require('../models');
const AppError = require( '../utils/app-error');
const { Op } = require('sequelize');

exports.getAllFarmers = async (
  page,
  limit,
  search,
  activation,
  landType
) => {

  const offset = (page - 1) * limit;

  const farmerWhere = {};

  if (landType) {
    farmerWhere.land_type = landType;
  }

  if (search) {
    farmerWhere[Op.or] = [
      { crops_type: { [Op.like]: `%${search}%` } },
      { address_governrate: { [Op.like]: `%${search}%` } },
      { address_city: { [Op.like]: `%${search}%` } },
      { address_village: { [Op.like]: `%${search}%` } },
      { address_street: { [Op.like]: `%${search}%` } },

      // search in User table
      { '$user.name$': { [Op.like]: `%${search}%` } },
      { '$user.phone$': { [Op.like]: `%${search}%` } }
    ];
  }


  if (activation) {
    farmerWhere['$user.is_active$'] = activation;
  }


  const { count, rows } = await Farmer.findAndCountAll({

    attributes: {
      exclude: ['created_at', 'updated_at', 'id']
    },

    where: farmerWhere,

    include: [
      {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['password', 'created_at', 'updated_at', 'id']
        },
        required: true
      }
    ],

    order: [
      ['created_at', 'DESC']
    ],

    limit,
    offset,

    distinct: true
  });


  return {
    total: count,
    current_page: page,
    total_pages: Math.ceil(count / limit),
    farmers: rows
  };
};