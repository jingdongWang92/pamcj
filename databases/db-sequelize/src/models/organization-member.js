const commonModelFields = require('../common_model_fields');
const organizationRoles = require('@jcmap/constant-organization-roles');
const get = require('lodash/fp/get');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, ENUM } = DataTypes;

  return sequelize.define('organization_member', {
    ...commonModelFields,
    organization_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('organization_id');
        return value == null ? value : value.toString();
      },
    },
    user_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('user_id');
        return value == null ? value : value.toString();
      },
    },
    role: {
      type: ENUM(Object.values(organizationRoles).map(get('code'))),
      defaultValue: organizationRoles.MEMBER.code,
      allowNull: false,
    },
  });
};
