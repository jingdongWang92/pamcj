const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER } = DataTypes;

  return sequelize.define('cartogram_collection_relation', {
    ...commonModelFields,
    cartogram_collection_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('cartogram_collection_id');
        return value == null ? value : value.toString();
      },
    },
    cartogram_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('cartogram_id');
        return value == null ? value : value.toString();
      },
    },
  });
};
