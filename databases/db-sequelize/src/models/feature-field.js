const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING } = DataTypes;

  return sequelize.define('feature_field', {
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
    description: {
      type: STRING,
    },
    data_type: {
      type: STRING,
      allowNull: false,
      defaultValue: 'string',
    },
    input_type: {
      type: STRING,
      allowNull: false,
      defaultValue: 'text',
    },
  });
};
