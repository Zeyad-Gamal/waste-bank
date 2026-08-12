'use strict';

module.exports = (sequelize, DataTypes) => {
  const EmailVerificationToken = sequelize.define(
    'EmailVerificationToken',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,

        references: {
          model: 'users',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      used_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'email_verification_tokens',

      timestamps: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',

      indexes: [
    {
      fields: ['user_id', 'used_at'],
    },
    {
      fields: ['expires_at'],
    },
  ],
    }
  );

  EmailVerificationToken.associate = (models) => {
    EmailVerificationToken.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return EmailVerificationToken;
};