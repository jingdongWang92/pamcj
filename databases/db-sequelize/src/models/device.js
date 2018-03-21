const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, BOOLEAN, DOUBLE } = DataTypes;

  return sequelize.define('device', {
    ...commonModelFields,
    app_eui: {
      type: STRING,
      allowNull: false,
    },
    mote_eui: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    main_key: {
      type: STRING,
      allowNull: false,
    },
    port: {
      type: INTEGER,
    },
    type: { // deprecated, use `device_type` instead
      type: STRING,
      allowNull: false,
    },
    electric_capacity: {
      type: DOUBLE,
    },
    status_period: {
      type: INTEGER,
    },
    is_online: {
      type: BOOLEAN,
    },
    software_version: {
      type: STRING,
    },
    hardware_version: {
      type: STRING,
    },
    last_receive_time: {
      type: STRING,
    },
  });
};
