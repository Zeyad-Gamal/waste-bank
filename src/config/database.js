// const { Sequelize } = require('sequelize');
// const dbConfig = require('./config');

// const sequelize = new Sequelize(
//   dbConfig.development.database,
//   dbConfig.development.username,
//   dbConfig.development.password,
//   {
//     host: dbConfig.development.host,
//     dialect: dbConfig.development.dialect,
//     logging: false,
//     // logging: console.log,
//   }
// );

// module.exports = sequelize;


const { Sequelize } = require('sequelize');

const dbConfig = require('./config');

const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    port: dbConfig.development.port,
    dialect: dbConfig.development.dialect,
    logging: false
  }
);

module.exports = sequelize;