'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('offers', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      farmer_id: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' }
      },
      type: Sequelize.STRING,
      quantity: Sequelize.FLOAT,
      quantity_gauge: { type: Sequelize.STRING, allowNull: false },
      cultivated_area: Sequelize.FLOAT,
      item_type: Sequelize.STRING,
      harvest_date: Sequelize.DATE,
      price: Sequelize.FLOAT,
      collection_location: Sequelize.STRING,
      description: Sequelize.TEXT,
      status: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('offers');
  }
};