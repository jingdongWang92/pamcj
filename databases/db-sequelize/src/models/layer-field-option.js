const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING } = DataTypes;

  return sequelize.define('layer_field_option', {
    ...commonModelFields,
    layer_field_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('layer_field_id');
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
