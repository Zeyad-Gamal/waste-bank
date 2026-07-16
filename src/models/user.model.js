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

      is_active: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
      },
    },
    {
      tableName: 'users',

      timestamps: true,
      paranoid: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  User.associate = (models) => {

    User.hasOne(models.Farmer, {
      foreignKey: 'user_id',
      as: 'farmer',
    });

    User.hasOne(models.Factory, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'factory',
    });

    User.hasMany(models.Offer, {
  foreignKey: 'farmer_id',
  as: 'offers',
});

  };

  return User;
};