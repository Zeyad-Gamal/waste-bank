const { Factory, User, sequelize } = require('../models');
const AppError = require( '../utils/app-error');
const { Op } = require('sequelize');

const bcrypt = require('bcryptjs');

const { generateToken } = require('../utils/jwt');


exports.getAllFactories = async (
  
  page,
  limit,
  search,
  activation,
  industry_type
) => {

  const offset = (page - 1) * limit;

  const factoryWhere = {};


    if (industry_type) {
    factoryWhere.industry_type = industry_type;
  }

  if (search) {
    factoryWhere[Op.or] = [
      { industrial_registration_number: { [Op.like]: `%${search}%` } },

      // search in User table
      { '$user.name$': { [Op.like]: `%${search}%` } },
      // { '$user.phone$': { [Op.like]: `%${search}%` } }
    ];
  }


  if (activation) {
    factoryWhere['$user.is_active$'] = activation;
  }


  const { count, rows } = await Factory.findAndCountAll({

    attributes: {
      exclude: ['created_at', 'updated_at', 'id']
    },

    where: factoryWhere,

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
    factories: rows
  };
};


exports.addFactory = async (data) => {

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


    const existingFactory = await Factory.findOne({
      where: {
        email: data.email,
      },
    });

    if (existingFactory) {
      throw new AppError('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create(
      {
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        role: 'factory',
        is_active: 'inactive'
      },
      { transaction }
    );

    const factory = await Factory.create(
      {
        user_id: user.id,

        email: data.email,

        factory_owner_name: data.factory_owner_name,

        address_governrate: data.address_governrate,
        address_city: data.address_city,
        address_village: data.address_village,
        address_street: data.address_street,

        industrial_registration_number:
          data.industrial_registration_number,

        industry_type: data.industry_type,

        factory_image: data.factory_image,
      },
      { transaction }
    );

    await transaction.commit();

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      token,

      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },

      factory,
    };

  } catch (error) {

    await transaction.rollback();

    throw error;
  }

};


exports.updateFarmerStatus = async (id , status) => {

  const factory = await User.findByPk(id);

  if (!factory) {
    throw new AppError('factory not found', 404);
  }

  factory.is_active = status;

  await factory.save();

  return factory;

};


exports.deleteFactory = async (id) => {


  const user = await User.findOne({
    where: { id },
  });

  if (!user) {
    throw new AppError("Factory not found", 404);
  }

  if (user.is_active == "active") {
    throw new AppError(
      "Only not active factories can be deleted",
      400
    );
  }


  await user.destroy();
};