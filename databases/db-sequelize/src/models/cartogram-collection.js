const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, DATE, BOOLEAN } = DataTypes;

  const CartogramCollection = sequelize.define('cartogram_collection', {
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
    public: {
      type: BOOLEAN,
    },
    ttl: {
      type: DATE,
    }
  });

  CartogramCollection.prototype.hasPermission = function (userId) {
    return this.sequelize.model('organization_member').findOne({
      where: {
        organization_id: this.owner_id,
        user_id: userId,
      },
    });
  };

  return CartogramCollection;
};
