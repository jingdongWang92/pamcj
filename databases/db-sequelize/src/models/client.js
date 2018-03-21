const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING } = DataTypes;

  return sequelize.define('client', {
    ...commonModelFields,
    owner_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('owner_id');
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
    access_key: {
      type: STRING,
      allowNull: false,
    },
    access_secret: {
      type: STRING,
      allowNull: false,
    },
    redirect_uri: {
      type: STRING,
    },
  });
};
