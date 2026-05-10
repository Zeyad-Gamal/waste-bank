'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('offers_images', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      offer_id: {
        type: Sequelize.UUID,
        references: { model: 'offers', key: 'id' }
      },
      image_url: { type: Sequelize.STRING, allowNull: false },
      image: { type: Sequelize.BLOB('long'), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('offers_images');
  }
};