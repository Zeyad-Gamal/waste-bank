'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sale_items', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      sale_id: {
        type: Sequelize.UUID,
        references: { model: 'sales', key: 'id' }
      },
      inventory_id: {
        type: Sequelize.UUID,
        references: { model: 'inventory', key: 'id' }
      },
      quantity: Sequelize.FLOAT
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('sale_items');
  }
};