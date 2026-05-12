'use strict';

module.exports = (sequelize, DataTypes) => {

  const Shipment = sequelize.define(
    'Shipment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      type: {
        type: DataTypes.ENUM('pickup', 'delivery'),
        allowNull: true,
      },

      related_type: {
        type: DataTypes.ENUM('purchase', 'sale'),
        allowNull: true,
      },

      related_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      driver_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      driver_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      vehicle_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      plate_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      scheduled_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      completed_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'shipments',

      timestamps: false,
    }
  );

  Shipment.associate = (models) => {

    Shipment.belongsTo(models.Purchase, {
      foreignKey: 'related_id',
      constraints: false,
      as: 'purchase',
    });

    Shipment.belongsTo(models.Sale, {
      foreignKey: 'related_id',
      constraints: false,
      as: 'sale',
    });

  };

  return Shipment;
};