'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('notifications', {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: 'users',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      data: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      read_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

    });

    await queryInterface.addIndex(
      'notifications',
      ['user_id', 'is_read']
    );

    await queryInterface.addIndex(
      'notifications',
      ['created_at']
    );
  },

  async down(queryInterface) {

    await queryInterface.dropTable('notifications');

  },
};