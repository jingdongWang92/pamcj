const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, GEOMETRY } = DataTypes;

  return sequelize.define('cartogram_georeference', {
    ...commonModelFields,
    cartogram_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('cartogram_id');
        return value == null ? value : value.toString();
      },
    },
    southWest: { // deprecated, use south_west instead
      type: GEOMETRY('POINT'),
    },
    southEast: { // deprecated, use south_east instead
      type: GEOMETRY('POINT'),
    },
    northEast: { // deprecated, use north_east instead
      type: GEOMETRY('POINT'),
    },
    northWest: { // deprecated, use north_west instead
      type: GEOMETRY('POINT'),
    },
    south_west: {
      type: GEOMETRY('POINT'),
    },
    south_east: {
      type: GEOMETRY('POINT'),
    },
    north_east: {
      type: GEOMETRY('POINT'),
    },
    north_west: {
      type: GEOMETRY('POINT'),
    },
  });
};
