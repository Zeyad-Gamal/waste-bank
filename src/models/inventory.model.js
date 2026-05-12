'use strict';

module.exports = (sequelize, DataTypes) => {

  const Inventory = sequelize.define(
    'Inventory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      purchase_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'purchases',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      remaining_quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      
      quantity_gauge: {
  type: DataTypes.ENUM('kg', 'ton'),
  allowNull: false,
},

      status: {
        type: DataTypes.ENUM(
          'available',
          'partially_used',
          'depleted'
        ),
        defaultValue: 'available',
      },
    },
    {
      tableName: 'inventory',

      timestamps: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Inventory.associate = (models) => {

    Inventory.belongsTo(models.Purchase, {
      foreignKey: 'purchase_id',
      as: 'purchase',
    });

    Inventory.hasMany(models.SaleItem, {
      foreignKey: 'inventory_id',
      as: 'sale_items',
    });

  };

  return Inventory;
};