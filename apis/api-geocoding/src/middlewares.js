const isNumber = require('is-number');
const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.geocoding = geocoding;
exports.reverseGeocoding = reverseGeocoding;
exports.inputTips = inputTips;


function configRoute(defaultRouteConfig={}) {
  return {
    geocoding: routeConfig => geocoding(merge(defaultRouteConfig, routeConfig)),
    reverseGeocoding: routeConfig => reverseGeocoding(merge(defaultRouteConfig, routeConfig)),
    inputTips: routeConfig => inputTips(merge(defaultRouteConfig, routeConfig)),
  };
}



function geocoding(routeConfig={}) {
  const { gaodeKey } = routeConfig;
  const gaode = require('./gaode')(gaodeKey);

  return async function (ctx) {
    ctx.assert(ctx.request.query.address, 400, '地址未提供');


    try {
      const result = await gaode.geocoding(ctx.request.query.address);


      ctx.body = {
        payload: result
      };
    } catch (err) {
      ctx.throw(400, err.message);
    }
  };
}

function reverseGeocoding(routeConfig={}) {
  const { gaodeKey } = routeConfig;
  const gaode = require('./gaode')(gaodeKey);

  return async function (ctx) {
    const {longitude, latitude} = ctx.request.query;
    ctx.assert(isNumber(longitude), 400, '无效经度');
    ctx.assert(isNumber(latitude), 400, '无效纬度');


    try {
      const result = await gaode.reverseGeocoding(longitude, latitude);


      ctx.body = {
        payload: result,
      };
    } catch (err) {
      ctx.throw(400, err.message);
    }
  };
}

function inputTips(routeConfig={}) {
  const { gaodeKey } = routeConfig;
  const gaode = require('./gaode')(gaodeKey);

  return async function (ctx) {
    try {
      ctx.assert(ctx.request.query.keywords, 400, 'keywords is required');
      const result = await gaode.inputTips(ctx.request.query);

      ctx.body = {
        payload: result
      };
    } catch (err) {
      ctx.throw(400, err.message);
    }
  };
}
