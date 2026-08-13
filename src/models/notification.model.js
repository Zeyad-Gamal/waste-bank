'use strict';

module.exports = (sequelize, DataTypes) => {

  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'users',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      data: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      read_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'notifications',

      timestamps: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Notification.associate = (models) => {

    Notification.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

  };

  return Notification;
};