const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, BOOLEAN, DATE } = DataTypes;

  const Organization = sequelize.define('organization', {
    ...commonModelFields,
    owner_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('owner_id');
        return value == null ? value : value.toString();
      },
    },
    plan_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('plan_id');
        return value == null ? value : value.toString();
      },
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    personal: {
      type: BOOLEAN,
    },
    plan_expired_at: {
      type: DATE,
    },
  });

  Organization.prototype.getRelationshipWithUser = function (userId) {
    if (!userId) { return null; }

    return this.sequelize.model('organization_member').findOne({
      where: {
        user_id: userId,
      },
    });
  }

  return Organization;
};
