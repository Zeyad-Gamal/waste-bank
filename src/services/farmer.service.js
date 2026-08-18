const { Farmer, User, sequelize } = require('../models');
const AppError = require( '../utils/app-error');
const { Op } = require('sequelize');

const bcrypt = require('bcryptjs');

const { generateToken } = require('../utils/jwt');


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


exports.addFarmer = async (data) => {

  const transaction = await sequelize.transaction();

  try {

    const existingUser = await User.findOne({
      where: {
        phone: data.phone,
      },
    });

    if (existingUser) {
      throw new AppError('Phone already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create(
      {
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        role: 'farmer',
        is_active: 'inactive'
      },
      { transaction }
    );

    const farmer = await Farmer.create(
      {
        user_id: user.id,

        national_id: data.national_id,
        national_id_image: data.national_id_image,

        birthdate: data.birthdate,

        land_size: data.land_size,
        land_type: data.land_type,
        crops_type: data.crops_type,

        harvest_location: data.harvest_location,

        proof_image: data.proof_image,

        address_governrate: data.address_governrate,
        address_city: data.address_city,
        address_village: data.address_village,
        address_street: data.address_street,
      },
      { transaction }
    );

    await transaction.commit();

    const token = generateToken({
      id: user.id,
      role: user.role,
      token_version: user.token_version,
    });

    return {
      token,

      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },

      farmer,
    };

  } catch (error) {

    await transaction.rollback();

    throw error;
  }

};


exports.updateFarmerStatus = async (id , status) => {

  const farmer = await User.findByPk(id);

  if (!farmer) {
    throw new AppError('farmer not found', 404);
  }

  farmer.is_active = status;

  await farmer.save();

  return farmer;

};


exports.deleteFarmer = async (id) => {


  const user = await User.findOne({
    where: { id },
  });

  if (!user) {
    throw new AppError("Farmer not found", 404);
  }

  if (user.is_active == "active") {
    throw new AppError(
      "Only not active farmers can be deleted",
      400
    );
  }


  await user.destroy(); // sets deletedAt
};