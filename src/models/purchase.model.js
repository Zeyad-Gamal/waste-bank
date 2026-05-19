'use strict';

module.exports = (sequelize, DataTypes) => {

  const Purchase = sequelize.define(
    'Purchase',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      offer_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'offers',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      quantity_gauge: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          'pending',
          'approved',
          'rejected',
          'completed'
        ),

        defaultValue: 'pending',
      },
    },

    {
      tableName: 'purchases',

      timestamps: true,

      createdAt: 'created_at',

      updatedAt: 'updated_at',
    }
  );

  Purchase.associate = (models) => {

    Purchase.belongsTo(models.Offer, {
      foreignKey: 'offer_id',
      as: 'offer',
    });

    Purchase.hasOne(models.Inventory, {
      foreignKey: 'purchase_id',
      as: 'inventory',
    });

  };

  return Purchase;

};