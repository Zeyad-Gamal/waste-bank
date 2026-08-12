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

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      is_active: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
      },

      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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


User.hasMany(models.EmailVerificationToken, {
  foreignKey: 'user_id',
  as: 'emailVerificationTokens',
});

  };

  return User;
};