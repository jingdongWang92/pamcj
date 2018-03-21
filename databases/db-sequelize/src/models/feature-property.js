const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING } = DataTypes;

  return sequelize.define('feature_property', {
    ...commonModelFields,
    feature_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('feature_id');
        return value == null ? value : value.toString();
      },
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    value: {
      type: STRING,
      set(value) {
        this.setDataValue('value', JSON.stringify(value));
      },
      get() {
        return JSON.parse(this.getDataValue('value'));
      },
    },
  });
};
