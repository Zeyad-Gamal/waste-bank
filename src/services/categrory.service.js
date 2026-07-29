const { Op, Sequelize } = require('sequelize');
const { Unit, Category, Offer, sequelize } = require('../models');
const AppError = require( '../utils/app-error');
const { symbol } = require('joi');

exports.createCategory = async (data) => {

  const transaction = await sequelize.transaction();

  try {


    const category = await Category.create({

      default_unit_id: data.unit_id,

      name: data.name,

      description: data.description,

    }, { transaction });


    await transaction.commit();

    return category;

  } catch (error) {

    await transaction.rollback();

    throw error;

  }

};



exports.updateCategory = async (
  categoryId,
  data
) => {

  const category = await Category.findOne({

    where: {
      id: categoryId
    },

  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }


  
  await category.update(data);

  return category;

};


exports.getAllCategories = async () => {
  

  const { count, rows } = await Category.findAndCountAll({

    include: [
      {
          model: Offer,
          as: 'offers',
        }
    ],

    order: [['created_at', 'DESC']],


    distinct: true,
  });

  return {
    total: count,
    categories: rows,
  };
};



