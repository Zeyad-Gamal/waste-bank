'use strict';

module.exports = (sequelize, DataTypes) => {

  const Unit = sequelize.define(
    'Unit',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },


      

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },


      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          'active',
          'inactive'
        ),
        defaultValue: 'inactive',
      },

      
    },
    {
      tableName: 'units',

      timestamps: true,


      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );


  Unit.associate = (models) => {

   Unit.hasMany(models.Offer, {
    foreignKey: "unit_id",
    as: "offers",
});

Unit.hasMany(models.Purchase, {
    foreignKey: "unit_id",
    as: "purchases",
});

Unit.hasMany(models.Inventory, {
    foreignKey: "unit_id",
    as: "inventory",
});


Unit.hasMany(models.Category, {
    foreignKey: "default_unit_id",
    as: "categories",
});

  };

  

  return Unit;
};