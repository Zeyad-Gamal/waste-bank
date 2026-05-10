'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('factory_requests', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      factory_id: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' }
      },
      category: Sequelize.STRING,
      quantity: Sequelize.FLOAT,
      quantity_gauge: { type: Sequelize.STRING, allowNull: false },
      max_price: Sequelize.FLOAT,
      status: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('factory_requests');
  }
};