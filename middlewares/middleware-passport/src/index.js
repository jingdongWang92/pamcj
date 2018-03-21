const axios = require('axios');
const merge = require('lodash/fp/merge');
const last = require('lodash/fp/last');


exports = module.exports = configRoutes;
exports.authJCT = authJCT;


function configRoutes(defaultRouteConfig={}) {
  return {
    authJCT: routeConfig => authJCT(merge(defaultRouteConfig, routeConfig)),
  };
}


function authJCT(routeConfig={}) {
  // 默认假设应用是部署在k8s环境
  const url = routeConfig.userApiUri || process.env.USER_API_URI || 'http://api-user/self';


  return async function (ctx, ...rest) {


    let token = (ctx.request.header.authorization || '').slice('Bearer '.length);
    if (!token) { token = ctx.request.query.token; }
    ctx.assert(token, 401)


    let res;
    try {
      res = await axios({
        url,
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
    } catch (err) {
      const statusCode = err.response.status;
      ctx.assert(statusCode !== 401 && statusCode !== 403, statusCode);
      ctx.assert(statusCode === 401 || statusCode === 403, statusCode, err.message);
    }


    const user = res.data.payload;
    ctx.assert(user, 401);


    user._id = user.id;
    ctx.state.user = user;


    if (routeConfig.immortal) {
      ctx.assert(user.role === 'immortal', 403);
    }


    await last(rest)();
  };
}
