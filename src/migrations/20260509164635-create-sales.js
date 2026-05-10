'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      factory_id: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' }
      },
      request_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'factory_requests', key: 'id' }
      },
      status: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('sales');
  }
};