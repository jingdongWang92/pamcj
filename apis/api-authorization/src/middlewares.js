'use strict';

exports.getAccessToken = getAccessToken;

const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);
const User = sequelize.model('user');
const AuthZhubajie = sequelize.model('auth_zhubajie');
const Organization = sequelize.model('organization');
const OrganizationMember = sequelize.model('organization_member');

const axios = require('axios');
const sha1 = require('js-sha1');

function getAccessToken() {
  const clientId = process.env.ZHUBAJIE_CLIENT_ID;
  const redirectRri = process.env.ZHUBAJIE_REDIRECT_URI;

  return async function(ctx) {
    ctx.assert(ctx.request.query.code, 400, 'authorize code is required');

    const param = Object.assign({}, {
      client_id: clientId,
      grant_type: 'authorization_code',
      redirect_uri: redirectRri,
      code: ctx.request.query.code,
    });
    const sign1 = sign(param);
    const res = await axios({
      url: '/oauth2/accesstoken',
      method: 'post',
      baseURL: 'http://openapi.zbj.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: Object.assign(param, {
        client_secret: sign1,
      }),
    });
    ctx.assert(!res.data.error, 400, res.data.error);

    //刷新token
    const refreshParam = {
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: res.data.refresh_token,
    }
    const sign2 = sign(refreshParam);
    const res1 = await axios({
      url: '/oauth2/refreshtoken',
      method: 'post',
      baseURL: 'http://openapi.zbj.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: Object.assign(refreshParam, {
        client_secret: sign2,
      }),
    });

    ctx.assert(!res1.data.error, 400, res1.data.error);

    const authZhubajie = await AuthZhubajie.findOne({
      include: [
        {
          model: User,
        },
      ],
      where: {
        zhubajie_openid: res1.data.openid,
      }
    });

    if(!authZhubajie) {

      //获取猪八戒用户信息
      const getUserParam = {
        appKey: process.env.ZHUBAJIE_CLIENT_ID,
        accessToken: res1.data.access_token,
        method: 'zbj.user.getUserBriefInfo',
        v: '1.0',
        format: 'json',
        timestamp: new Date().getTime(),
        openid: res1.data.openid,
      };

      const userInfo = await axios({
        url: 'http://openapi.zbj.com/router',
        method: 'get',
        params: Object.assign(getUserParam, {
          sign: sign(getUserParam),
        }),
      });

      const transaction = await sequelize.transaction();

      const user = await User.create({
        role: 'mortal',
        username: userInfo.data.nickname,
        avatar: userInfo.data.avatarPath,
      }, { transaction });

      const organization = await Organization.create({
        name: userInfo.data.nickname,
        personal: true,
        owner_id: user.id,
      }, { transaction });

      await OrganizationMember.create({
        user_id: user.id,
        organization_id: organization.id,
        role: 'owner',
      }, { transaction });

      await AuthZhubajie.create({
        user_id: user.id,
        zhubajie_openid: res1.data.openid
      }, { transaction });

      await transaction.commit();

    }

    const jcToken = await axios({
      url: 'https://jcmap.jcbel.com/apis/token/zhubajie',
      method: 'post',
      data: {
        openid: res1.data.openid,
      },
    });
    ctx.redirect(`https://jcmap.jcbel.com/token-storge/#?access_token=${jcToken.data.payload.access_token}`);

    ctx.body = {
      payload: {
        authZhubajie,
      },
    };
  };
}


function sign(reqParam) {
  const clientSecret = process.env.ZHUBAJIE_CLIENT_SECRET;
  let sortParam = {};
  Object.keys(reqParam).sort().forEach(function(k){sortParam[k]=reqParam[k]});

  let signStr = '';
  for (let key in sortParam){
    signStr += key + sortParam[key];
  }
  signStr =  clientSecret + signStr + clientSecret;
  return sha1(signStr).toUpperCase();
}
