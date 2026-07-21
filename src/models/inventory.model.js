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

      unit_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'units',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      category_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'categories',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      
      total_quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      
      
      remaining_quantity: {
        type: DataTypes.FLOAT,
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

    Inventory.belongsTo(models.Category, {
    foreignKey: "category_id",
    as: "category",
});

  Inventory.belongsTo(models.Unit, {
    foreignKey: "unit_id",
    as: "unit",
});

  };

  return Inventory;
};