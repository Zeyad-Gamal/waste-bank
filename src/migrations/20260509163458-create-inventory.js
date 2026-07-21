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

       unit_id: {
        type: Sequelize.UUID,
        references: { model: 'units', key: 'id' }
      },

       category_id: {
        type: Sequelize.UUID,
        references: { model: 'categories', key: 'id' }
      },

      remaining_quantity: Sequelize.FLOAT,

      total_quantity: Sequelize.FLOAT,
      
      status: Sequelize.STRING,

      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: {
  type: Sequelize.DATE,
  defaultValue: Sequelize.NOW
},
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('inventory');
  }
};