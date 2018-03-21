const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, DATE } = DataTypes;

  return sequelize.define('access_token', {
    ...commonModelFields,
    user_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('user_id');
        return value == null ? value : value.toString();
      },
    },
    client_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('client_id');
        return value == null ? value : value.toString();
      },
    },
    token: {
      type: STRING,
      allowNull: false,
    },
    jwtid: {
      type: STRING(255),
      allowNull: false,
    },
    ttl: {
      type: DATE,
    },
  });
};
