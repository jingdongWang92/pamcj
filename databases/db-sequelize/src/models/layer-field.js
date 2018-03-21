const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, ENUM } = DataTypes;

  return sequelize.define('layer_field', {
    ...commonModelFields,
    layer_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('layer_id');
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
      type: ENUM('string', 'number', 'boolean'),
      allowNull: false,
      defaultValue: 'string',
    },
    input_type: {
      type: ENUM('text', 'number', 'radio', 'checkbox', 'select', 'color'),
      allowNull: false,
      defaultValue: 'text',
    },
    default_value: {
      type: STRING,
      allowNull: false,
    }
  });
};
