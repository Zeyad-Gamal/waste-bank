'use strict';

module.exports = (sequelize, DataTypes) => {

  const Factory = sequelize.define(
    'Factory',
    {

      id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
},
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

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      factory_owner_name: {
        type: DataTypes.STRING,
        allowNull: false,
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
        allowNull: false,
      },

      address_street: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      industrial_registration_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      industry_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      factory_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'factories',

      timestamps: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Factory.associate = (models) => {

    Factory.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

  };

  return Factory;
};
