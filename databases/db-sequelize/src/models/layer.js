const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, BOOLEAN, ENUM } = DataTypes;

  return sequelize.define('layer', {
    ...commonModelFields,
    owner_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('owner_id');
        return value == null ? value : value.toString();
      },
    },
    geometry_style_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('geometry_style_id');
        return value == null ? value : value.toString();
      },
    },
    code: {
      type: STRING,
      allowNull: false,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    geometry_type: {
      type: ENUM('Point', 'Curve', 'Surface'),
      allowNull: false,
    },
    sequence: { // 显示顺序
      type: INTEGER,
      defaultValue: 0,
    },
    is_created_by_system: {
      type: BOOLEAN,
      defaultValue: false,
    },
  });
};
