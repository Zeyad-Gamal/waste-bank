'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM('farmer', 'factory', 'admin'),
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'users',

      timestamps: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  User.associate = (models) => {

    User.hasOne(models.Farmer, {
      foreignKey: 'user_id',
      as: 'farmer_profile',
    });

    User.hasOne(models.Factory, {
      foreignKey: 'user_id',
      as: 'factory_profile',
    });

  };

  return User;
};