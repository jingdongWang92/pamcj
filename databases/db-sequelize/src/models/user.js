const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { STRING, ENUM, DATE, BOOLEAN } = DataTypes;

  return sequelize.define('user', {
    ...commonModelFields,
    email: {
      type: STRING,
      allowNull: true,
      unique: true,
      valuedate: {
        isEmail: true,
      },
    },
    password: {
      type: STRING,
      allowNull: true,
      get() {
        return () => this.getDataValue('password');
      },
    },
    access_key: {
      type: STRING(64),
    },
    access_secret: {
      type: STRING(128),
    },
    role: {
      type: ENUM('mortal', 'immortal'),
      allowNull: false,
      defaultValue: 'mortal',
    },
    plan_expired_at: {
      type: DATE,
    },
    username: {
      type: STRING,
    },
    email_verified: {
      type: BOOLEAN,
      defaultValue: false,
    },
    avatar: {
      type: String,
    }
  });
};
