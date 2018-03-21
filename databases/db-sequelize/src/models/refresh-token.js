const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { STRING, DATE } = DataTypes;

  return sequelize.define('refresh_token', {
    ...commonModelFields,
    token: {
      type: STRING,
      allowNull: false,
    },
    ttl: {
      type: DATE,
    }
  });
};
