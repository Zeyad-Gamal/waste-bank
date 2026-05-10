const { Sequelize } = require('sequelize');
const dbConfig = require('./config');

const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    logging: false,
  }
);

module.exports = sequelize;