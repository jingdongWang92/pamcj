const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER } = DataTypes;

  return sequelize.define('plan_order', {
    ...commonModelFields,
    order_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('order_id');
        return value == null ? value : value.toString();
      },
    },
    buyer_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('buyer_id');
        return value == null ? value : value.toString();
      },
    },
  });
};
