const { Op, Sequelize } = require('sequelize');
const { Industry , sequelize } = require('../models');
const AppError = require( '../utils/app-error');



exports.getAllIndustries = async () => {
  

  const rows= await Industry.findAll({


    order: [['created_at', 'DESC']],


    distinct: true,
  });

  return {
    industries: rows,
  };
};



