'use strict';

module.exports = (sequelize, DataTypes) => {

  const Category = sequelize.define(
    'Category',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },


      default_unit_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'units',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      
    },
    {
      tableName: 'categories',

      timestamps: true,


      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );


  Category.associate = (models) => {

   Category.hasMany(models.Offer, {
    foreignKey: "category_id",
    as: "offers",
});

Category.hasMany(models.Inventory, {
    foreignKey: "category_id",
    as: "inventory",
});


Category.belongsTo(models.Unit, {
    foreignKey: "default_unit_id",
    as: "defaultUnit",
});
  };

  

  return Category;
};