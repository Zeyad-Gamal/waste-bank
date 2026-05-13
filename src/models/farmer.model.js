'use strict';

module.exports = (sequelize, DataTypes) => {

  const Farmer = sequelize.define(
    'Farmer',
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,

        references: {
          model: 'users',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      national_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      national_id_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      birthdate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      land_size: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      land_type: {
        type: DataTypes.ENUM('rent', 'owner'),
        allowNull: true,
      },

      crops_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      harvest_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      proof_image: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
      },

      address_governrate: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address_city: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address_village: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address_street: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'farmers',

      timestamps: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Farmer.associate = (models) => {

    Farmer.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

  };

  return Farmer;
};