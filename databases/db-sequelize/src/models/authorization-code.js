const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, DATE } = DataTypes;

  return sequelize.define('authorization_code', {
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
    code: {
      type: STRING,
      allowNull: false,
    },
    redirect_uri: {
      type: STRING,
    },
    ttl: {
      type: DATE,
    }
  });
};
