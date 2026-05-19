'use strict';

module.exports = (sequelize, DataTypes) => {

  const SaleItem = sequelize.define(
    'SaleItem',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      sale_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'sales',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      inventory_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'inventory',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      quantity: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      tableName: 'sale_items',

      timestamps: false,
    }
  );

  SaleItem.associate = (models) => {

    SaleItem.belongsTo(models.Sale, {
      foreignKey: 'sale_id',
      as: 'sale',
    });

    SaleItem.belongsTo(
    models.Inventory,
    {
      foreignKey: 'inventory_id',
      as: 'inventory'
    }
  );

  };

  return SaleItem;
};