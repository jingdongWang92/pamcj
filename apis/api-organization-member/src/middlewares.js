const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.beforeSearchOrganizationMembers = beforeSearchOrganizationMembers;
exports.beforeRemoveOrganizationMember = beforeRemoveOrganizationMember;


function configRoute(defaultRouteConfig={}) {
  return {
    beforeSearchOrganizationMembers: routeConfig => beforeSearchOrganizationMembers(merge(defaultRouteConfig, routeConfig)),
    beforeRemoveOrganizationMember: routeConfig => beforeRemoveOrganizationMember(merge(defaultRouteConfig, routeConfig)),
  };
}



function beforeSearchOrganizationMembers(routeConfig={}) {

  return async function (ctx, next) {
    await next();
  };
}


function beforeRemoveOrganizationMember(routeConfig={}) {
  const { sequelize } = routeConfig;
  const OrganizationMember = sequelize.model('organization_member');

  return async function (ctx, organizationMemberId, next) {
    ctx.state.organizationRelationship = await OrganizationMember.findById(organizationMemberId);

    await next();
  };
}
