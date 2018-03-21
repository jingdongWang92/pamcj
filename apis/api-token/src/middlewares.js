const passwordUtils = require('@jcnetwork/password-utils');
const nanoId = require('nanoid');
const moment = require('moment');
const ms = require('ms');
const tokenUtil = require('@jcnetwork/util-token');
const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);


const Client = sequelize.model('client');
const RefreshToken = sequelize.model('refresh_token');
const User = sequelize.model('user');
const AuthorizationCode = sequelize.model('authorization_code');
const AccessToken = sequelize.model('access_token');
const AuthZhubajie = sequelize.model('auth_zhubajie');

exports.grantAuthorizationCode = grantAuthorizationCode;
exports.grantResourceOwnerPasswordCredentials = grantResourceOwnerPasswordCredentials;
exports.grantClientCredentials = grantClientCredentials;
exports.grantRefreshToken = grantRefreshToken;
exports.fetchToken = fetchToken;
exports.fetchTokenByZBJOponid = fetchTokenByZBJOponid;

function grantAuthorizationCode() {
  return async function (ctx, next) {
    if (ctx.request.body.grant_type !== 'authorization_code') { return await next(); }
    const code = ctx.request.query.code || ctx.request.body.code;
    const redirectUri = ctx.request.query.redirect_uri || ctx.request.body.redirect_uri;
    const authorizationCode = await AuthorizationCode
        .findOne({
          code,
          redirect_uri: redirectUri,
        })
        .populate('user')
        .exec();
    ctx.assert(authorizationCode, 401, 'invalid authorization code');
    ctx.state.user = authorizationCode.user;
    await next();
  };
}


function grantResourceOwnerPasswordCredentials() {
  return async function (ctx, next) {
    if (ctx.request.body.grant_type !== 'password') { return await next(); }
    const { username, password } = ctx.request.body;
    const user = await User.find({
      where: {
        email: username,
      },
    });
    const isPasswordMatch = await passwordUtils.comparePassword(password, user.password());
    ctx.assert(isPasswordMatch, 401, 'username or password not match');

    ctx.state.user = user;
    await next();
  };
}


function grantClientCredentials() {
  return async function (ctx, next) {
    if (ctx.request.body.grant_type !== 'client_credentials') { return await next(); }
    const { access_key, access_secret, client_id, client_secret } = ctx.request.body;
    ctx.assert(!access_key || !client_id, 401, 'access_key is missing');
    ctx.assert(!access_secret || !client_secret, 401, 'access_secret is missing');


    const _access_key = access_key || client_id;
    const _access_secret = access_secret || client_secret;


    const client = await Client
        .findOne({
          access_key: _access_key,
          access_secret: _access_secret,
        })
        .populate('user')
        .exec();

    const user = await User.findOne({
      access_key: _access_key,
      access_secret: _access_secret,
    }).exec();


    const _user = client ? client.user : user;


    ctx.assert(_user, 401, '无效的access_key和access_secret组合');

    ctx.state.user = _user;
    ctx.state.client = client;
    await next();
  };
}


function grantRefreshToken() {
  return async function (ctx, next) {
    if (ctx.request.body.grant_type !== 'refreshtoken') { return await next(); }
    const { refresh_token } = ctx.request.body;
    const token = await RefreshToken
        .findOne({ token: refresh_token })
        .populate('user')
        .populate('client')
        .exec();

    ctx.state.user = token.user;
    await next();
  };
}


function fetchToken() {
  const jwtSecret = process.env.JWT_SECRET;
  const defaultJwtConfig = {
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: ms(process.env.JWT_EXPIRES_IN), // 转换为毫秒
    notBefore: ms(process.env.JWT_NOT_BEFORE || 0), // 转换为毫秒
  };


  return async function (ctx) {
    ctx.assert(ctx.state.user, 401);


    const { user, client } = ctx.state;


    ctx.assert(user.email_verified, 401, '邮件地址尚未验证');


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
    if (client) {
      accessTokenConfig.audience = client.id;
      accessTokenConfig.subject = client.name;
    }
    const accessTokenString = await tokenUtil.generateJSONWebToken(payload, jwtSecret, accessTokenConfig);


    const accessToken = await AccessToken.create({ // eslint-disable-line no-unused-vars
      jwtid: accessTokenConfig.jwtid,
      token: accessTokenString,
      scope,
      user_id: user.id,
      client_id: client && client.id,
      ttl: moment().add(accessTokenConfig.expiresIn, 'ms').toDate(),
    });


    const refreshTokenConfig = Object.assign({}, defaultJwtConfig, accessTokenConfig, {
      expiresIn: accessTokenConfig.expiresIn + ms('30d'),
    });
    const refreshTokenString = await tokenUtil.generateJSONWebToken(payload, jwtSecret, refreshTokenConfig);


    const refreshToken = await RefreshToken.create({ // eslint-disable-line no-unused-vars
      jwtid: refreshTokenConfig.jwtid,
      token: refreshTokenString,
      scope,
      user_id: user.id,
      client_id: client && client.id,
      ttl: moment().add(refreshTokenConfig.expiresIn, 'ms').toDate(),
    });


    const data = {
      access_token: accessTokenString,
      token_type: 'JWT',
      expires_in: accessTokenConfig.expiresIn / 1000, // 转换为秒, https://tools.ietf.org/html/rfc6749#page-73
      refresh_token: refreshTokenString,
      scope: scope.join(' '),
      user,
    };

    ctx.body = Object.assign({
      payload: data,
    }, data);
  };
}

function fetchTokenByZBJOponid() {
  const jwtSecret = process.env.JWT_SECRET;
  const defaultJwtConfig = {
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: ms(process.env.JWT_EXPIRES_IN), // 转换为毫秒
    notBefore: ms(process.env.JWT_NOT_BEFORE || 0), // 转换为毫秒
  };


  return async function (ctx) {
    const authZhubajie = await AuthZhubajie.findOne({
      where: {
        zhubajie_openid: ctx.request.body.openid,
      }
    });
    ctx.assert(authZhubajie, 401);

    const user = await User.findById(authZhubajie.user_id);
    ctx.assert(user, 401);

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


    const accessToken = await AccessToken.create({ // eslint-disable-line no-unused-vars
      jwtid: accessTokenConfig.jwtid,
      token: accessTokenString,
      scope,
      user_id: user.id,
      ttl: moment().add(accessTokenConfig.expiresIn, 'ms').toDate(),
    });


    const refreshTokenConfig = Object.assign({}, defaultJwtConfig, accessTokenConfig, {
      expiresIn: accessTokenConfig.expiresIn + ms('30d'),
    });
    const refreshTokenString = await tokenUtil.generateJSONWebToken(payload, jwtSecret, refreshTokenConfig);


    const refreshToken = await RefreshToken.create({ // eslint-disable-line no-unused-vars
      jwtid: refreshTokenConfig.jwtid,
      token: refreshTokenString,
      scope,
      user_id: user.id,
      ttl: moment().add(refreshTokenConfig.expiresIn, 'ms').toDate(),
    });


    const data = {
      access_token: accessTokenString,
      token_type: 'JWT',
      expires_in: accessTokenConfig.expiresIn / 1000, // 转换为秒, https://tools.ietf.org/html/rfc6749#page-73
      refresh_token: refreshTokenString,
      scope: scope.join(' '),
      user,
    };

    ctx.body = Object.assign({
      payload: data,
    }, data);
  };
}
