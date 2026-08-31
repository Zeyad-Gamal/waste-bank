'use strict';

module.exports = (sequelize, DataTypes) => {

  const Industry = sequelize.define(
    'Industry',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },


      code: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'industries',

      timestamps: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );


 


  return Industry;
};