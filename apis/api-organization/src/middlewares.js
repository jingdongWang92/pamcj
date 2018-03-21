const moment = require('moment');
const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.beforeCreateOrganization = beforeCreateOrganization;
exports.createOrganization = createOrganization;
exports.searchOrganizations = searchOrganizations;
exports.fetchOrganization = fetchOrganization;
exports.updateOrganization = updateOrganization;
exports.removeOrganization = removeOrganization;
exports.beforeSearchOrganizationInvitations = beforeSearchOrganizationInvitations;
exports.beforeCreateOrganizationInvitation = beforeCreateOrganizationInvitation;
exports.beforeAcceptOrganizationInvitation = beforeAcceptOrganizationInvitation;
exports.beforeRejectOrganizationInvitation = beforeRejectOrganizationInvitation;
exports.beforeSearchOrganizationMembers = beforeSearchOrganizationMembers;
exports.beforeRemoveOrganizationMember = beforeRemoveOrganizationMember;


function configRoute(defaultRouteConfig={}) {
  return {
    beforeCreateOrganization: routeConfig => beforeCreateOrganization(merge(defaultRouteConfig, routeConfig)),
    createOrganization: routeConfig => createOrganization(merge(defaultRouteConfig, routeConfig)),
    searchOrganizations: routeConfig => searchOrganizations(merge(defaultRouteConfig, routeConfig)),
    fetchOrganization: routeConfig => fetchOrganization(merge(defaultRouteConfig, routeConfig)),
    updateOrganization: routeConfig => updateOrganization(merge(defaultRouteConfig, routeConfig)),
    removeOrganization: routeConfig => removeOrganization(merge(defaultRouteConfig, routeConfig)),
    beforeSearchOrganizationInvitations: routeConfig => beforeSearchOrganizationInvitations(merge(defaultRouteConfig, routeConfig)),
    beforeCreateOrganizationInvitation: routeConfig => beforeCreateOrganizationInvitation(merge(defaultRouteConfig, routeConfig)),
    beforeAcceptOrganizationInvitation: routeConfig => beforeAcceptOrganizationInvitation(merge(defaultRouteConfig, routeConfig)),
    beforeRejectOrganizationInvitation: routeConfig => beforeRejectOrganizationInvitation(merge(defaultRouteConfig, routeConfig)),
    beforeSearchOrganizationMembers: routeConfig => beforeSearchOrganizationMembers(merge(defaultRouteConfig, routeConfig)),
    beforeRemoveOrganizationMember: routeConfig => beforeRemoveOrganizationMember(merge(defaultRouteConfig, routeConfig)),
  };
}


function beforeCreateOrganization(routeConfig) {
  const { sequelize } = routeConfig;
  const Organization = sequelize.model('organization');
  const Plan = sequelize.model('plan');

  return async function beforeCreateOrganization(ctx, next) {

    const organization = await Organization.findOne({
      where: {
        owner_id: ctx.state.user.id,
        personal: true,
      },
      include: [
        {
          model: Plan,
        },
      ],
    });

    ctx.assert(organization, 400, 'organization not found');
    ctx.assert(organization.plan, 400, '免费版没有创建团队的权限')
    ctx.assert(moment().isBefore(organization.plan_expired_at), 400, '方案已过期');

    const total = await Organization.count({
      where: {
        owner_id: ctx.state.user.id,
      },
    });
    const limit = organization.plan.organization_count;
    ctx.assert(total < limit, 400, `该账号当前最多只能创建${limit}个团队`);
    return next();
  };
}

function createOrganization(routeConfig) {
  const { sequelize } = routeConfig;
  const Organization = sequelize.model('organization');
  const OrganizationMember = sequelize.model('organization_member');
  const User = sequelize.model('user');
  const Plan = sequelize.model('plan');


  return async function createOrganization(ctx) {
    ctx.assert(ctx.request.body.name, 400, 'organization name is required');

    const organization = await Organization.create(Object.assign({}, ctx.request.body, {
      owner_id: ctx.state.user.id,
    }));
    await OrganizationMember.create({
      organization_id: organization.id,
      user_id: ctx.state.user.id,
      role: 'owner',
    });


    await organization.reload({
      include: [
        {
          model: User,
          as: 'owner',
        },
        {
          model: User,
          as: 'members',
        },
        // {
        //   model: User,
        //   as: 'relation',
        //   where: {
        //     id: ctx.state.user.id,
        //   },
        // },
        {
          model: Plan,
        },
      ],
    });


    ctx.body = {
      payload: organization,
    };
  };
}


function searchOrganizations(routeConfig) {
  const { sequelize } = routeConfig;
  const Organization = sequelize.model('organization');
  const User = sequelize.model('user');
  const Plan = sequelize.model('plan');
  const OrganizationMember = sequelize.model('organization_member');
  const Op =  sequelize.Op;


  return async function (ctx) {
    const organizationMembers = await OrganizationMember.findAll({
      where: {
        user_id: ctx.state.user.id,
      },
    });
    const { rows: organizations, count: total } = await Organization.findAndCountAll({
      where: {
        id: {
          [Op.in]: organizationMembers.map(member => member.organization_id),
        },
      },
      limit: ctx.request.query.limit,
      offset: ctx.request.query.skip,
      include: [
        {
          model: User,
          as: 'owner'
        },
        {
          model: User,
          as: 'members',
        },
        {
          model: Plan,
        },
      ],
    });

    ctx.body = {
      payload: organizations,
      meta: { total },
    };
  };
}


function fetchOrganization(routeConfig) {
  const { sequelize } = routeConfig;
  const Organization = sequelize.model('organization');


  return async function (ctx, organizationId) {

    const organization = await Organization.findById(organizationId);
    ctx.assert(organization, 404, 'no Organization found');

    ctx.body = {
      payload: organization,
    };
  };
}


function updateOrganization(routeConfig) {
  const { sequelize } = routeConfig;
  const Organization = sequelize.model('organization');


  return async function (ctx, organizationId) {
    ctx.assert(ctx.request.body.name, 400, 'organization name is required');

    const organization = await Organization.find({
      where: {
        id: organizationId,
        owner: ctx.state.user.id,
      }
    });
    ctx.assert(organization, 400, 'no Organization found');

    await organization.update(Object.assign({}, organization, ctx.request.body));

    ctx.body = {
      payload: organization,
    };
  };
}


function removeOrganization(routeConfig) {
  const { sequelize } = routeConfig;
  const Organization = sequelize.model('organization');
  const User = sequelize.model('user');


  return async function (ctx, organizationId) {
    const organization = await Organization.find({
      where: {
        id: organizationId,
      },
      include: [
        {
          model: User,
          as: 'owner',
          where: {
            id: ctx.state.user.id,
          },
        },
      ],
    });
    ctx.assert(organization, 400, 'no organization found');

    // 伪删除，仅标记deleted_at属性
    await organization.destroy();

    ctx.status = 204;
  };
}


function beforeSearchOrganizationInvitations(routeConfig) {

  return async function (ctx, organizationId, next) {
    ctx.request.query.organization_id = organizationId;

    await next();
  };
}


function beforeCreateOrganizationInvitation(routeConfig) {

  return async function (ctx, organizationId, next) {
    ctx.request.body.organization_id = organizationId;

    await next();
  };
}


function beforeAcceptOrganizationInvitation(routeConfig) {
  const { sequelize } = routeConfig;
  const OrganizationInvitation = sequelize.model('organization_invitation');

  return async function (ctx, organizationId, invitationId, next) {
    ctx.state.organizationInvitation = await OrganizationInvitation.findById(invitationId);

    await next();
  };
}


function beforeRejectOrganizationInvitation(routeConfig) {
  const { sequelize } = routeConfig;
  const OrganizationInvitation = sequelize.model('organization_invitation');

  return async function (ctx, organizationId, invitationId, next) {
    ctx.state.organizationInvitation = await OrganizationInvitation.findById(invitationId);

    await next();
  };
}


function beforeSearchOrganizationMembers(routeConfig) {

  return async function (ctx, organizationId, next) {
    ctx.request.query.organization_id = organizationId;
    await next();
  };
}


function beforeRemoveOrganizationMember(routeConfig) {
  const { sequelize } = routeConfig;
  const OrganizationMember = sequelize.model('organization_member');


  return async function (ctx, organizationId, userId, next) {
    ctx.state.organizationRelationship = await OrganizationMember.findOne({
      where: {
        organization_id: organizationId,
        user_id: userId,
      },
    });

    await next();
  };
}
