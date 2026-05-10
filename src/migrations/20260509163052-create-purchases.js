'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchases', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      offer_id: {
        type: Sequelize.UUID,
        references: { model: 'offers', key: 'id' }
      },
      quantity: Sequelize.FLOAT,
      quantity_gauge: { type: Sequelize.STRING, allowNull: false },
      price: Sequelize.FLOAT,
      status: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('purchases');
  }
};