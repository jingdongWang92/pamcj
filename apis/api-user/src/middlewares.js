const passwordUtils = require('@jcnetwork/password-utils');
const uuid = require('uuid');
const sendMail = require('@jcnetwork/mail-utils');
const validator = require('validator');
const url = require('url');
const tokenUtil = require('@jcnetwork/util-token');
const moment = require('moment');
const nanoId = require('nanoid');
const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.createUser = createUser;
exports.searchUsers = searchUsers;
exports.fetchSelf = fetchSelf;
exports.fetchUser = fetchUser;
exports.updateUser = updateUser;
exports.removeUser = removeUser;
exports.changePassword = changePassword;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.markUserEmailVerified = markUserEmailVerified;
exports.sendRegisterEmail = sendRegisterEmail;
exports.impersonateUser = impersonateUser;


function configRoute(defaultRouteConfig={}) {
  return {
    createUser: routeConfig => createUser(merge(defaultRouteConfig, routeConfig)),
    searchUsers: routeConfig => searchUsers(merge(defaultRouteConfig, routeConfig)),
    fetchSelf: routeConfig => fetchSelf(merge(defaultRouteConfig, routeConfig)),
    fetchUser: routeConfig => fetchUser(merge(defaultRouteConfig, routeConfig)),
    updateUser: routeConfig => updateUser(merge(defaultRouteConfig, routeConfig)),
    removeUser: routeConfig => removeUser(merge(defaultRouteConfig, routeConfig)),
    changePassword: routeConfig => changePassword(merge(defaultRouteConfig, routeConfig)),
    forgotPassword: routeConfig => forgotPassword(merge(defaultRouteConfig, routeConfig)),
    resetPassword: routeConfig => resetPassword(merge(defaultRouteConfig, routeConfig)),
    markUserEmailVerified: routeConfig => markUserEmailVerified(merge(defaultRouteConfig, routeConfig)),
    sendRegisterEmail: routeConfig => sendRegisterEmail(merge(defaultRouteConfig, routeConfig)),
    impersonateUser: routeConfig => impersonateUser(merge(defaultRouteConfig, routeConfig)),
  };
}


function createUser(routeConfig={}) {
  const {
    jwtSecret,
    defaultJwtConfig,
    immortalEmails,
    sendRegisterEmail,
    sequelize,
    registrationConfirmUrl,
  } = routeConfig;
  const User = sequelize.model('user');
  const AccessToken = sequelize.model('access_token');
  const Organization = sequelize.model('organization');
  const OrganizationMember = sequelize.model('organization_member');


  return async function (ctx) {
    ctx.assert(ctx.request.body.email, 400, 'email is required');
    ctx.assert(validator.isEmail(`${ctx.request.body.email}`), 400, 'invalid email address');
    ctx.assert(ctx.request.body.password, 400, 'password is required');

    const transaction = await sequelize.transaction();
    try {
      const [user, userCreated] = await User.findOrCreate({
        where: {
          email: ctx.request.body.email,
        },
        defaults: {
          password: await passwordUtils.hashPassword(ctx.request.body.password),
          access_key: uniqueString(16),
          access_secret: uniqueString(32),
          role: immortalEmails.includes(ctx.request.body.email) ? 'immortal' : 'mortal',
          username: ctx.request.body.username,
        },
        transaction,
      });
      ctx.assert(userCreated, 400, 'user exists');

      const [organization, organizationCreated] = await Organization.findOrCreate({ // eslint-disable-line no-unused-vars
        where: {
          name: ctx.request.body.username || ctx.request.body.email,
          personal: true,
        },
        defaults: {
          owner_id: user.id,
        },
        transaction,
      });

      await OrganizationMember.create({
        user_id: user.id,
        organization_id: organization.id,
        role: 'owner',
      }, {
        transaction,
      });
      await transaction.commit();

      if (sendRegisterEmail) {
        const payload = {
          uid: user.id,
        };


        const scope = [
          'https://paas.apis.jcbel.com/devices',
          'https://paas.apis.jcbel.com/cartograms',
          'https://paas.apis.jcbel.com/cartogram-collections',
        ]; // TODO: scope尚未实现

        const accessTokenConfig = Object.assign({}, defaultJwtConfig, {
          jwtid: nanoId(),
          issuer: user.id,
        });
        const accessTokenString = await tokenUtil.generateJSONWebToken(payload, jwtSecret, accessTokenConfig);


        const accessToken = await AccessToken.create({
          jwtid: accessTokenConfig.jwtid,
          token: accessTokenString,
          user_id: user.id,
          scope,
          ttl: moment().add(accessTokenConfig.expiresIn, 'ms').toDate(),
        });

        const link = url.format(Object.assign({}, url.parse(registrationConfirmUrl), {
          query: {
            email: user.email,
            token: accessToken.token,
          },
        }));

        await sendMail(user.email, '电子邮件地址确认', {
          html: `
            <p>
              点击此链接<a href="${link}">${registrationConfirmUrl}</a>以完成注册
            </p>
          `,
        });
      }

      ctx.body = {
        payload: user,
        meta: {
          organization,
        },
      };
    } catch (e) {
      await transaction.rollback();
      ctx.throw(e);
    }
  };
}


function searchUsers(routeConfig={}) {
  const {
    sequelize,
  } = routeConfig;
  const Op = sequelize.Op;
  const User = sequelize.model('user');
  const Plan = sequelize.model('plan');


  return async function searchUsers(ctx) {

    const { rows: users, count: total } = await User
        .findAndCountAll({
          limit: ctx.request.query.limit,
          offset: ctx.request.query.skip,
          include: [
            {
              model: Plan,
            },
          ],
          where: {
            id: {
              [Op.ne]: ctx.state.user.id,
            },
          },
        });
    ctx.body = {
      payload: users,
      meta: { total },
    };
  };
}


function fetchSelf(routeConfig={}) {
  const {
    jwtSecret,
    defaultJwtConfig,
    sequelize,
  } = routeConfig;
  const User = sequelize.model('user');
  const Client = sequelize.model('client');
  const AccessToken = sequelize.model('access_token');
  const Organization = sequelize.model('organization');
  const Plan = sequelize.model('plan');


  return async function fetchSelf(ctx) {
    const token = (ctx.request.header.authorization || '').slice('Bearer '.length);
    ctx.assert(token, 401);


    const accessToken = await AccessToken.find({
      where: {
        token,
      },
      include: [
        User,
      ],
    });
    ctx.assert(accessToken, 401);


    const { user, client } = accessToken;
    try {
      const jwtConfig = Object.assign({}, defaultJwtConfig, {
        jwtid: accessToken.jwtid,
        issuer: user.id,
      });


      if (client) {
        jwtConfig.audience = client.id;
        jwtConfig.subject = client.name;
      }


      await tokenUtil.verifyJSONWebToken(token, jwtSecret, jwtConfig);
    } catch (err) {
      ctx.throw(401);
    }


    const isUserValid = await User.find({
      where: {
        id: user.id,
      },
    });
    ctx.assert(isUserValid, 401);


    if (client) {
      const isClientValid = await Client.find({
        where: {
          id: client.id,
          owner: user.id,
        },
      });
      ctx.assert(isClientValid, 401);
    }

    const organization = await Organization.findOne({
      where: {
        personal: true,
      },
      include: [
        {
          model: User,
          as: 'owner',
          where: {
            id: user.id,
          },
        },
        {
          model: Plan,
        },
      ],
    });

    await user.reload({
      include: [
        {
          model: Plan,
        }
      ],
    });

    ctx.body = {
      payload: user,
      meta: {
        organization,
      },
    };
  };
}


function fetchUser(routeConfig={}) {
  const {
    sequelize,
  } = routeConfig;
  const User = sequelize.model('user');


  return async function fetchUser(ctx, userId) {
    const user = await User.find({
      where: {
        id: userId,
      },
    });
    ctx.assert(user, 404, 'no user found');
    ctx.body = {
      payload: user,
    };
  };
}


function updateUser(routeConfig={}) {
  const {
    sequelize,
  } = routeConfig;
  const User = sequelize.model('user');


  return async function (ctx, userId) {
    ctx.assert(ctx.request.body.email, 400, 'email is required');
    ctx.assert(validator.isEmail(`${ctx.request.body.email}`), 400, 'invalid email address');

    const user = await User.findById(userId);
    ctx.assert(user, 400, 'no user found');

    if(ctx.request.body.email !== user.email) {
      const existUser = await User.findOne({
        where: {
          email: ctx.request.body.email,
        }
      });
      ctx.assert(!existUser, 400, 'email is already taken');
    }

    await user.update(ctx.request.body);

    ctx.body = {
      payload: user,
    };
  };
}


function removeUser(routeConfig={}) {

  return async function (ctx) {
    ctx.status = 503;
  };
}


function changePassword(routeConfig={}) {
  const {
    sequelize,
  } = routeConfig;
  const User = sequelize.model('user');


  return async function (ctx) {
    ctx.assert(ctx.request.body.password_origin, 400, '原密码不能为空');
    ctx.assert(ctx.request.body.password, 400, '新密码不能为空');
    ctx.assert(ctx.request.body.password_confirm, 400, '确认密码不能为空');

    const password_origin = ctx.request.body.password_origin;
    const password = ctx.request.body.password;
    const password_confirm = ctx.request.body.password_confirm;

    const isSamePassword = (password === password_confirm);
    ctx.assert(isSamePassword, 400, '两次输入的密码不一致');

    const user = await User.find({
      where: {
        id: ctx.state.user.id,
      },
    });
    const isPasswordMatch = await passwordUtils.comparePassword(password_origin, user.password);
    ctx.assert(isPasswordMatch, 400, '原密码错误');

    await user.udpate({
      password: await passwordUtils.hashPassword(password),
    }, {
      fields: ['password'],
    });

    ctx.status = 204;
  };
}


function forgotPassword(routeConfig={}) {
  const {
    jwtSecret,
    defaultJwtConfig,
    sequelize,
    passwordResetUrl,
  } = routeConfig;
  const scope = []; // TODO: scope尚未实现
  const User = sequelize.model('user');
  const AccessToken = sequelize.model('access_token');


  return async function (ctx) {
    ctx.assert(ctx.request.body.email, 400, '邮件地址不能为空');
    ctx.assert(validator.isEmail(`${ctx.request.body.email}`), 400, '无效的邮件地址');

    const user = await User.find({
      where: {
        email: ctx.request.body.email,
      },
    });
    ctx.assert(user, 400, '用户不存在');

    const [accessTokenString, jwtConfig] = await genAccessTokenOfUser(user, jwtSecret, defaultJwtConfig);

    const accessToken = await AccessToken.create({
      jwtid: jwtConfig.jwtid,
      token: accessTokenString,
      user_id: user.id,
      scope,
      ttl: moment().add(jwtConfig.expiresIn, 'ms').toDate(),
    });

    const link = url.format(Object.assign({}, url.parse(passwordResetUrl), {
      query: {
      },
    }));

    await sendMail(user.email, '甲虫账号密码重置', {
      html: `
        <p>
          请点击下面的链接重置密码
        </p>
        <p>
          <a href="${link}#token=${accessToken.token}">${passwordResetUrl}</a>
        </p>
      `,
    });

    ctx.status = 204;
  };
}


function resetPassword(routeConfig={}) {
  const {
    sequelize,
  } = routeConfig;
  const User = sequelize.model('user');


  return async function (ctx) {
    ctx.assert(ctx.request.body.password, 400, '密码不能为空');
    ctx.assert(ctx.request.body.confirm_password, 400, '确认密码不能为空');

    const isSamePassword = (ctx.request.body.password === ctx.request.body.confirm_password);
    ctx.assert(isSamePassword, 400, '两次输入的密码不一致');

    const user = await User.findById(ctx.state.user.id);
    await user.update({
      password: await passwordUtils.hashPassword(ctx.request.body.password),
    }, {
      fields: ['password'],
    });


    ctx.status = 204;
  };
}


function uniqueString(len) {
  const times = Math.ceil(len / 32);
  const raw = [];
  for (let i = 0; i < times; i += 1) {
    raw.push(uuid());
  }
  return raw.join('').replace(/-/g, '').slice(0, len);
}


function markUserEmailVerified(routeConfig={}) {
  const {
    sequelize,
  } = routeConfig;
  const User = sequelize.model('user');


  return async function (ctx, userId) {
    const user = await User.findById(userId);
    ctx.assert(user, 400, 'no user found');

    if (!user.emailVerified) {
      await user.update({
        email_verified: true,
      });
    }

    ctx.body = {
      payload: user,
    };
  };
}


function sendRegisterEmail(routeConfig={}) {
  const {
    jwtSecret,
    defaultJwtConfig,
    sequelize,
    registrationConfirmUrl,
  } = routeConfig;
  const scope = []; // TODO: scope尚未实现
  const User = sequelize.model('user');
  const AccessToken = sequelize.model('access_token');


  return async function (ctx, userId) {
    const user = await User.findById(userId);
    ctx.assert(user, 400, 'user does not exists');

    const [accessTokenString, jwtConfig] = await genAccessTokenOfUser(user, jwtSecret, defaultJwtConfig);

    const accessToken = await AccessToken.create({
      jwtid: jwtConfig.jwtid,
      token: accessTokenString,
      user_id: user.id,
      scope,
      ttl: moment().add(jwtConfig.expiresIn, 'ms').toDate(),
    });

    const link = url.format(Object.assign({}, url.parse(registrationConfirmUrl), {
      query: {
        email: user.email,
        token: accessToken.token,
      },
    }));

    await sendMail(user.email, '电子邮件地址确认', {
      html: `
        <p>
          点击此链接<a href="${link}">${registrationConfirmUrl}</a>以完成注册
        </p>
      `,
    });

    ctx.body = {
      payload: user,
    };
  };
}


function impersonateUser(routeConfig={}) {
  const {
    jwtSecret,
    defaultJwtConfig,
    sequelize,
  } = routeConfig;
  const scope = []; // TODO: scope尚未实现
  const User = sequelize.model('user');
  const AccessToken = sequelize.model('access_token');


  return async function (ctx, userId) {
    ctx.assert(ctx.state.user.role === 'immortal', 403);

    const user = await User.findById(userId);
    ctx.assert(user, 400, 'user does not exists');
    ctx.assert(user.role === 'mortal', 403);

    const [accessTokenString, jwtConfig] = await genAccessTokenOfUser(user, jwtSecret, defaultJwtConfig);

    const accessToken = await AccessToken.create({
      jwtid: jwtConfig.jwtid,
      token: accessTokenString,
      user_id: user.id,
      scope,
      ttl: moment().add(jwtConfig.expiresIn, 'ms').toDate(),
    });

    ctx.body = {
      payload: {
        access_token: accessToken.token,
      },
    };
  };
}


async function genAccessTokenOfUser(user, jwtSecret, jwtConfig) {
  const payload = {
    uid: user.id,
  };

  const _jwtConfig = Object.assign({}, jwtConfig, {
    jwtid: nanoId(),
    issuer: user.id,
  });

  const tokenString = await tokenUtil.generateJSONWebToken(payload, jwtSecret, _jwtConfig);
  return [tokenString, _jwtConfig];
}
