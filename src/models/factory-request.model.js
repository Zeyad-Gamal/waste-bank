'use strict';

module.exports = (sequelize, DataTypes) => {

  const FactoryRequest = sequelize.define(
    'FactoryRequest',
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


      quantity: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },


      max_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
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
      tableName: 'factory_requests',

      timestamps: false,
    }
  );

  FactoryRequest.associate = (models) => {

    FactoryRequest.belongsTo(models.Factory, {
      foreignKey: 'factory_id',
      targetKey: 'user_id',
      as: 'factory',
    });


    FactoryRequest.belongsTo(models.Category, {
      foreignKey: 'category_id',
      targetKey: 'id',
      as: 'category',
    });

    FactoryRequest.hasMany(models.Sale, {
      foreignKey: 'request_id',
      as: 'sales',
    });

  };

  return FactoryRequest;
};