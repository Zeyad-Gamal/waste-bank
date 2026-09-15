// module.exports = {
//   development: {
//     username: "root",
//     password: "",
//     database: "waste_bank",
//     host: "127.0.0.1",
//     dialect: "mysql"
//   }
// };


// module.exports = {
//   development: {
//     username: "phpmyadmin",
//     password: "StrongPassword123!",
//     database: "waste_bank",
//     host: "127.0.0.1",
//     dialect: "mysql"
//   }
// };


// require('dotenv').config();

// module.exports = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'mysql'
//   }
// };



require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
};