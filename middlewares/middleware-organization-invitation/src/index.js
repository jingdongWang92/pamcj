const sendMail = require('@jcnetwork/mail-utils');
const validator = require('validator');
const merge = require('lodash/fp/merge');
const organizationRoles = require('@jcmap/constant-organization-roles');


const roleMap = Object.values(organizationRoles).reduce((accu, { name, code }) => ({
  ...accu,
  [code]: name,
}), {});


exports = module.exports = configRoute;
exports.createOrganizationInvitation = createOrganizationInvitation;
exports.searchOrganizationInvitations = searchOrganizationInvitations;
exports.acceptOrganizationInvitation = acceptOrganizationInvitation;
exports.rejectOrganizationInvitation = rejectOrganizationInvitation;


function configRoute(defaultRouteConfig={}) {
  return {
    createOrganizationInvitation: routeConfig => createOrganizationInvitation(merge(defaultRouteConfig, routeConfig)),
    searchOrganizationInvitations: routeConfig => searchOrganizationInvitations(merge(defaultRouteConfig, routeConfig)),
    acceptOrganizationInvitation: routeConfig => acceptOrganizationInvitation(merge(defaultRouteConfig, routeConfig)),
    rejectOrganizationInvitation: routeConfig => rejectOrganizationInvitation(merge(defaultRouteConfig, routeConfig)),
  }
}


function createOrganizationInvitation(routeConfig) {
  const { sequelize } = routeConfig;
  const Organization = sequelize.model('organization');
  const OrganizationInvitation = sequelize.model('organization_invitation');


  return async function (ctx) {
    const { organization_id, email, role } = ctx.request.body;

    ctx.assert(organization_id, 400, 'organization_id is required');
    ctx.assert(email, 400, '邮箱不能为空');
    ctx.assert(role, 400, '角色不能为空');
    ctx.assert(validator.isEmail(`${email}`), 409, '无效的Email');


    const organization = await Organization.findById(organization_id);
    ctx.assert(organization, 400, 'no organization found');


    const invitation = await OrganizationInvitation.findOne({
      where: {
        email: email,
        organization_id: organization_id,
      },
    });
    ctx.assert(!invitation, 400, '已经邀请过了');


    const organizationInvitation = await OrganizationInvitation.create({
      organization_id,
      email,
      role,
    });
    const user = ctx.state.user;

    await sendMail(email, `甲虫网络 - 「${user.username || user.email}」邀请您加入「${organization.name}」`, {
      html: `
        <p>
          您已被「${user.username || user.email}」邀请作为「${roleMap[role]}」参与「${organization.name}」团队的协作。
        </p>
        <p>您可<a href="https://jcmap.jcbel.com/login">登录甲虫网络地图工具</a>查看此团队</p>
      `,
    });


    ctx.body = {
      payload: organizationInvitation,
    };
  };
}


function searchOrganizationInvitations(routeConfig) {
  const { sequelize } = routeConfig;
  const Organization = sequelize.model('organization');
  const OrganizationInvitation = sequelize.model('organization_invitation');


  return async function (ctx) {
    const { limit, skip } = ctx.request.query;

    const { rows: invitations, count: total } = await OrganizationInvitation.findAndCountAll({
      where: {
        email: ctx.state.user.email
      },
      limit,
      offset: skip,
      include: [
        {
          model: Organization,
        },
      ],
    });

    ctx.body = {
      payload: invitations,
      meta: { total, limit, skip, },
    };
  };
}


function acceptOrganizationInvitation(routeConfig) {
  const { sequelize } = routeConfig;
  const OrganizationMember = sequelize.model('organization_member');


  return async function (ctx) {
    const organizationInvitation = ctx.state.organizationInvitation;
    ctx.assert(organizationInvitation, 400, 'invitation not found');

    ctx.assert(ctx.state.user.email === organizationInvitation.email, 403);

    const transaction = await sequelize.transaction();
    try {

      const organizationRelationship = await OrganizationMember.create({
        role: organizationInvitation.role,
        organization_id: organizationInvitation.organization_id,
        user_id: ctx.state.user.id,
      });
      await organizationInvitation.destroy();

      await transaction.commit();

      ctx.body = {
        payload: organizationRelationship,
      };
    } catch (err) {
      await transaction.rollback();
      ctx.throw(err);
    }
  };
}


function rejectOrganizationInvitation(routeConfig) {

  return async function (ctx) {
    const organizationInvitation = ctx.state.organizationInvitation;
    console.log(ctx.state.organizationInvitation);
    ctx.assert(organizationInvitation, 400, 'invitation not found');

    ctx.assert(ctx.state.user.email === organizationInvitation.email, 403);

    await organizationInvitation.destroy();

    ctx.status = 204;
  };
}
