const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {

  return sequelize.define('user_plan', {
    ...commonModelFields,
  });
};
