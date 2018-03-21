const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, ENUM, GEOMETRY, UUID } = DataTypes;

  const Feature = sequelize.define('feature', {
    ...commonModelFields,
    owner_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('owner_id');
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
    layer_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('layer_id');
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
    uuid: {
      type: UUID,
      allowNull: false,
    },
    geometry_type: {
      type: ENUM('Point', 'Curve', 'Surface'),
      allowNull: false,
    },
    geometry: {
      type: GEOMETRY,
      allowNull: false,
    },
  });

  Feature.prototype.hasPermission = function (userId) {
    return this.sequelize.model('organization_member').findOne({
      where: {
        organization_id: this.owner_id,
        user_id: userId,
      },
    });
  };

  return Feature;
};
