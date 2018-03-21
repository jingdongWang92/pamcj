const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.beforeSearchOrganizationInvitations = beforeSearchOrganizationInvitations;
exports.beforeCreateOrganizationInvitation = beforeCreateOrganizationInvitation;
exports.beforeAcceptOrganizationInvitation = beforeAcceptOrganizationInvitation;
exports.beforeRejectOrganizationInvitation = beforeRejectOrganizationInvitation;


function configRoute(defaultRouteConfig={}) {
  return {
    beforeSearchOrganizationInvitations: routeConfig => beforeSearchOrganizationInvitations(merge(defaultRouteConfig, routeConfig)),
    beforeCreateOrganizationInvitation: routeConfig => beforeCreateOrganizationInvitation(merge(defaultRouteConfig, routeConfig)),
    beforeAcceptOrganizationInvitation: routeConfig => beforeAcceptOrganizationInvitation(merge(defaultRouteConfig, routeConfig)),
    beforeRejectOrganizationInvitation: routeConfig => beforeRejectOrganizationInvitation(merge(defaultRouteConfig, routeConfig)),
  };
}


function beforeCreateOrganizationInvitation(routeConfig) {

  return async function (ctx, next) {
    await next();
  };
}

function beforeSearchOrganizationInvitations(routeConfig) {

  return async function (ctx, next) {
    await next();
  };
}


function beforeAcceptOrganizationInvitation(routeConfig) {
  const { sequelize } = routeConfig;
  const OrganizationInvitation = sequelize.model('organization_invitation');


  return async function (ctx, organizationInvitationId, next) {
    ctx.state.organizationInvitation = await OrganizationInvitation.findById(organizationInvitationId);

    await next();
  };
}


function beforeRejectOrganizationInvitation(routeConfig) {
  const { sequelize } = routeConfig;
  const OrganizationInvitation = sequelize.model('organization_invitation');


  return async function (ctx, organizationInvitationId, next) {
    ctx.state.organizationInvitation = await OrganizationInvitation.findById(organizationInvitationId);

    await next();
  };
}
