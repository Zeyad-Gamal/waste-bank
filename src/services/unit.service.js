const { Op, Sequelize } = require('sequelize');
const { Unit, Category, sequelize } = require('../models');
const AppError = require( '../utils/app-error');
const { symbol } = require('joi');

exports.createUnit = async (data) => {

  const transaction = await sequelize.transaction();

  try {


    const unit = await Unit.create({

      name: data.name,

      symbol: data.symbol,

      type: data.type,

      status: 'active',

    }, { transaction });


    await transaction.commit();

    return unit;

  } catch (error) {

    await transaction.rollback();

    throw error;

  }

};



exports.updateUnit = async (
  unitId,
  data
) => {

  const unit = await Unit.findOne({

    where: {
      id: unitId
    },

  });

  if (!unit) {
    throw new AppError('Unit not found', 404);
  }

  if (unit.status !== 'active') {

    throw new AppError(
      'Only active units can be updated',
      400
    );

  }
  
  await unit.update(data);

  return unit;

};


exports.getAllUnits = async () => {
  

  const { count, rows } = await Unit.findAndCountAll({

    include: [
      {
          model: Category,
          as: 'categories',
        }
    ],

    order: [['created_at', 'DESC']],


    distinct: true,
  });

  return {
    total: count,
    units: rows,
  };
};



