'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('units', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      name: Sequelize.STRING,
      symbol: Sequelize.STRING,
      type: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM('inactive', 'active'),
        allowNull: false,
        defaultValue: 'inactive',
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: {type: Sequelize.DATE,defaultValue: Sequelize.NOW},

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('units');
  }
};
