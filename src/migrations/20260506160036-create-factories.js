'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('factories', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      email: { type: Sequelize.STRING, unique: true , allowNull: false},
      factory_owner_name: { type: Sequelize.STRING, allowNull: false },
      address_governrate: Sequelize.STRING,
      address_city: Sequelize.STRING,
      address_village: { type: Sequelize.STRING, allowNull: false },
      address_street: Sequelize.STRING,
      industrial_registration_number: { type: Sequelize.STRING, unique: true , allowNull: false},
      industry_type: { type: Sequelize.STRING, allowNull: false },
      factory_image: Sequelize.STRING,



  user_id: {
  type: Sequelize.UUID,
  primaryKey: true,

  references: {
    model: 'users',
    key: 'id'
  },

  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
},

      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('factories');
  }
};