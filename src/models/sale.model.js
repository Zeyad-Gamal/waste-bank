'use strict';

module.exports = (sequelize, DataTypes) => {

  const Sale = sequelize.define(
    'Sale',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      factory_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'users',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      request_id: {
        type: DataTypes.UUID,
        allowNull: true,

        references: {
          model: 'factory_requests',
          key: 'id',
        },

        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'sales',

      timestamps: false,
    }
  );

  Sale.associate = (models) => {

    Sale.belongsTo(models.Factory, {
      foreignKey: 'factory_id',
      targetKey: 'user_id',
      as: 'factory',
    });

    Sale.belongsTo(models.FactoryRequest, {
      foreignKey: 'request_id',
      as: 'request',
    });

    Sale.hasMany(models.SaleItem, {
      foreignKey: 'sale_id',
      as: 'sale_items',
    });

  };

  return Sale;
};