const commonModelFields = require('../common_model_fields');
const {
  LEVEL_0,
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
} = require('@jcmap/constant-plan-levels');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, DECIMAL, BOOLEAN, ENUM } = DataTypes;

  return sequelize.define('plan', {
    ...commonModelFields,
    name: {
      type: STRING,
      allowNull: false,
    },
    level: {
      type: ENUM(LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3),
    },
    alias: {
      type: STRING,
    },
    is_enabled: {
      type: BOOLEAN,
      defaultValue: false,
    },
    price: {
      type: DECIMAL(10, 2),
    },
    organization_count: {
      type: INTEGER,
      defaultValue: 0,
    },
    project_count: {
      type: INTEGER,
      defaultValue: 0,
    },
    map_count : {
      type: INTEGER,
      defaultValue: 0,
    },
    file_export: {
      type: BOOLEAN,
      defaultValue: false,
    },
    sdk: {
      type: BOOLEAN,
      defaultValue: true,
    },
    app_tool: {
      type: BOOLEAN,
      defaultValue: true,
    },
    devices_management: {
      type: BOOLEAN,
      defaultValue: false,
    },
    layer_define: {
      type: BOOLEAN,
      defaultValue: false,
    },
    style_define: {
      type: BOOLEAN,
      defaultValue: false,
    },
    custom_service: {
      type: BOOLEAN,
      defaultValue: false,
    },
  });
};
