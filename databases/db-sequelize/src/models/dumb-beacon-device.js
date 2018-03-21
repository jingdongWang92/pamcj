const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, DOUBLE } = DataTypes;

  return sequelize.define('dumb_beacon_device', {
    ...commonModelFields,
    uuid: {
      type: STRING,
    },
    major: {
      type: INTEGER,
    },
    minor: {
      type: INTEGER,
    },
    electric_capacity: {
      type: DOUBLE,
    },
    transmitting_power: {
      type: DOUBLE,
    },
  });
};
