'use strict';

module.exports = (sequelize, DataTypes) => {

  const Offer = sequelize.define(
    'Offer',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      farmer_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'farmers',
          key: 'user_id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          'pending',
          'under_review',
          'partially_purchased',
          'fully_purchased',
          'rejected'
        ),
        defaultValue: 'pending',
      },
    },
    {
      tableName: 'offers',

      timestamps: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Offer.associate = (models) => {

    Offer.belongsTo(models.Farmer, {
      foreignKey: 'farmer_id',
      as: 'farmer',
    });

    Offer.hasMany(models.Purchase, {
      foreignKey: 'offer_id',
      as: 'purchases',
    });

  };

  return Offer;
};