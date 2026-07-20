'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },

      default_unit_id: {
        type: Sequelize.UUID,
        references: { model: 'units', key: 'id' }
      },

      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: {type: Sequelize.DATE,defaultValue: Sequelize.NOW},

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  }
};
