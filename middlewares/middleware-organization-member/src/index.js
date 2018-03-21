const merge = require('lodash/fp/merge');
const { OWNER, ADMIN } = require('@jcmap/constant-organization-roles');


exports = module.exports = configRoutes;
exports.searchOrganizationMembers = searchOrganizationMembers;
exports.removeOrganizationMember = removeOrganizationMember;


function configRoutes(defaultRouteConfig={}) {
  return {
    searchOrganizationMembers: routeConfig => searchOrganizationMembers(merge(defaultRouteConfig, routeConfig)),
    removeOrganizationMember: routeConfig => removeOrganizationMember(merge(defaultRouteConfig, routeConfig)),
  };
}


function searchOrganizationMembers(routeConfig) {
  const { sequelize } = routeConfig;
  const Organization = sequelize.model('organization');
  const User = sequelize.model('user');


  return async function (ctx) {
    const { rows: members, count: total } = await User.findAndCountAll({
      limit: ctx.request.query.limit,
      offset: ctx.request.query.skip,
      include: [
        {
          model: Organization,
          as: 'member_of',
          where: {
            id: ctx.request.query.organization_id,
          },
        },
      ],
    });


    ctx.body = {
      payload: members,
      meta: { total },
    };
  };
}


function removeOrganizationMember(routeConfig) {
  const { sequelize } = routeConfig;
  const OrganizationMember = sequelize.model('organization_member');

  return async function (ctx) {

    const organizationRelationship = ctx.state.organizationRelationship;

    if (organizationRelationship) {
      ctx.assert(organizationRelationship.role !== OWNER.code, 400, ' can not remove owner');

      const organizationRelationshipWithOperator = await OrganizationMember.findOne({
        where: {
          organization_id: organizationRelationship.organization_id,
          user_id: ctx.state.user.id,
        },
      });
      ctx.assert( [OWNER.code, ADMIN.code].includes(organizationRelationshipWithOperator.role), 403);

      await organizationRelationship.destroy();
    }

    ctx.status = 204;
  };
}
