'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmers', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      national_id: { type: Sequelize.STRING, unique: true , allowNull: false},
      national_id_image: Sequelize.STRING,
      birthdate: Sequelize.DATE,
      land_size: { type: Sequelize.FLOAT, allowNull: false },
      land_type: { type: Sequelize.ENUM('rent', 'owner'), allowNull: false },
      crops_type: { type: Sequelize.STRING, allowNull: false },
      proof_image: Sequelize.STRING,
      harvest_location: Sequelize.STRING,
      address_governrate: Sequelize.STRING,
      address_city: Sequelize.STRING,
      address_village: { type: Sequelize.STRING, allowNull: false },
      address_street: Sequelize.STRING,
  //     user_id: {
  //   type: Sequelize.UUID,
  //   unique: true,
  //   references: { model: 'users', key: 'id' }
  // },


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
    await queryInterface.dropTable('farmers');
  }
};