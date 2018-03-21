const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, ENUM } = DataTypes;

  return sequelize.define('auth_zhubajie', {
    ...commonModelFields,
    user_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('user_id');
        return value == null ? value : value.toString();
      },
    },
    zhubajie_openid: {
      type: STRING,
      allowNull: false,
    },
  });
};
