'use strict';

const { underscoredIf } = require("sequelize/lib/utils");

module.exports = (sequelize, DataTypes) => {

  const OfferImage = sequelize.define(
    'OfferImage',
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

      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
    const value = this.getDataValue('image_url');

    if (!value) return null;

    return `${process.env.BASE_URL}/${value}`;
  }
      },

    //   created_at: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW,
    //   },

    //   updated_at: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW,
    //   },
    },
    {
      tableName: 'offers_images',

      timestamps: true,
      underscored: true
    }
  );

  OfferImage.associate = (models) => {

    OfferImage.belongsTo(models.Offer, {
      foreignKey: 'offer_id',
      as: 'offer',
    });

  };

  return OfferImage;
};