'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      type: {
        type: Sequelize.ENUM('pickup', 'delivery')
      },

      related_type: {
        type: Sequelize.ENUM('purchase', 'sale')
      },

      related_id: {
        type: Sequelize.UUID
      },

      // Driver info directly
      driver_name: {
        type: Sequelize.STRING
      },

      driver_phone: {
        type: Sequelize.STRING
      },

      vehicle_type: {
        type: Sequelize.STRING
      },

      plate_number: {
        type: Sequelize.STRING
      },

      status: {
        type: Sequelize.STRING
      },

      scheduled_date: {
        type: Sequelize.DATE
      },

      completed_date: {
        type: Sequelize.DATE
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('shipments');
  }
};