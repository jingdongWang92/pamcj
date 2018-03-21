const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, ENUM } = DataTypes;

  const CartogramRoute = sequelize.define('cartogram_route', {
    ...commonModelFields,
    cartogram_collection_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('cartogram_collection_id');
        return value == null ? value : value.toString();
      },
    },
    from_feature_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('from_feature_id');
        return value == null ? value : value.toString();
      },
    },
    to_feature_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('to_feature_id');
        return value == null ? value : value.toString();
      },
    },
    oneway: {
      type: ENUM('yes', 'no'),
      defaultValue: 'no',
    },
    highway: {
      type: ENUM('both', 'footway', 'motorway'),
      defaultValue: 'both',
    },
  });

  CartogramRoute.prototype.hasPermission = async function(userId) {
    let organizationId = this.organization && this.organization.id;

    if (!organizationId) {
      const cartogramCollection = await this.sequelize.model('cartogram_collection').findById(this.cartogram_collection_id);
      if (!cartogramCollection) { return false; }

      organizationId = cartogramCollection.owner_id;
    }

    return this.sequelize.model('organization_member').findOne({
      where: {
        organization_id: organizationId,
        user_id: userId,
      },
    });
  };

  return CartogramRoute;
};
