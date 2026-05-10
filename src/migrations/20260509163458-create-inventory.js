'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      purchase_id: {
        type: Sequelize.UUID,
        references: { model: 'purchases', key: 'id' }
      },
      remaining_quantity: Sequelize.FLOAT,
      quantity_gauge: { type: Sequelize.STRING, allowNull: false },
      status: Sequelize.STRING
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('inventory');
  }
};