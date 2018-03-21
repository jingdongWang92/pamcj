const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, DATE, BOOLEAN, DECIMAL, ENUM } = DataTypes;

  return sequelize.define('order', {
    ...commonModelFields,
    user_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('user_id');
        return value == null ? value : value.toString();
      },
    },
    plan_id: {
      type: INTEGER,
      allowNull: false,
    },
    trade_no: {
      type: STRING,
      allowNull: false,
    },
    organization_id: {
      type: INTEGER,
      allowNull: false,
    },
    merchandise_name: {
      type: STRING,
      allowNull: false,
    },
    trade_amount: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    pay_method: {
      type: ENUM('alipay', 'wxpay'),
    },
    payed_at: {
      type: DATE,
    },
    pay_status: {
      type: ENUM('unpay', 'success', 'failed', 'refund'),
      defaultValue: 'unpay',
    },
    invoiced: {
      type: BOOLEAN,
      defaultValue: false,
    },
  });
};
