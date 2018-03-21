const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, DECIMAL } = DataTypes;

  return sequelize.define('invoice', {
    ...commonModelFields,
    user_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('user_id');
        return value == null ? value : value.toString();
      },
    },
    amount: {
      type: DECIMAL,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    contact: {
      type: STRING,
    },
    taxpayer_no: {
      type: STRING,
    },
    mobile_phone: {
      type: STRING,
      allowNull: false,
    },
    address: {
      type: STRING,
      allowNull: false,
    },
    express: {
      type: STRING,
    },
    tracking_no: {
      type: STRING,
    },
    status: {
      type: STRING,
    },
  });
};
