module.exports=
(sequelize,DataTypes)=>{

const ProcessRating= sequelize.define('ProcessRating',{

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

user_id:{

    type: DataTypes.UUID,

    defaultValue: DataTypes.UUIDV4,

    primaryKey:true
},

purchase_id: DataTypes.UUID,

sale_id: DataTypes.UUID,

rating:{

    type: DataTypes.INTEGER,
    allowNull: false

},

comment: DataTypes.TEXT,

},

{

tableName:  'process_ratings',

timestamps: true,

createdAt:  'created_at',

updatedAt:  'updated_at',

}

);

ProcessRating.associate=
(models)=>{

ProcessRating.belongsTo(
models.User,
{
foreignKey:
'user_id',
as:
'user'
}
);

ProcessRating.belongsTo(
models.Purchase,
{
foreignKey:
'purchase_id',
as:
'purchase'
}
);


ProcessRating.belongsTo(
models.Sale,
{
foreignKey:
'sale_id',
as:
'sale'
}
);

};

return ProcessRating;

};