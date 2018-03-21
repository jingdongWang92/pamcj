const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { STRING } = DataTypes;

  return sequelize.define('device_type', {
    ...commonModelFields,
    product_name: {
      type: STRING,
    },
    model_name: {
      type: STRING,
    },
    product_code: {
      type: STRING,
    },
    model_code: {
      type: STRING,
    },
    description: {
      type: STRING,
    },
  });
};
