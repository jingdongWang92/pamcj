const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.createGeometryStyle = createGeometryStyle;
exports.searchGeometryStyles = searchGeometryStyles;
exports.fetchGeometryStyle = fetchGeometryStyle;
exports.updateGeometryStyle = updateGeometryStyle;
exports.removeGeometryStyle = removeGeometryStyle;


function configRoute(defaultRouteConfig={}) {
  return {
    createGeometryStyle: routeConfig => createGeometryStyle(merge(defaultRouteConfig, routeConfig)),
    searchGeometryStyles: routeConfig => searchGeometryStyles(merge(defaultRouteConfig, routeConfig)),
    fetchGeometryStyle: routeConfig => fetchGeometryStyle(merge(defaultRouteConfig, routeConfig)),
    updateGeometryStyle: routeConfig => updateGeometryStyle(merge(defaultRouteConfig, routeConfig)),
    removeGeometryStyle: routeConfig => removeGeometryStyle(merge(defaultRouteConfig, routeConfig)),
  };
}




function createGeometryStyle(routeConfig={}) {
  const { sequelize } = routeConfig;
  const GeometryStyle = sequelize.model('geometry_style');

  return async function createGeometryStyle(ctx) {

    ctx.assert(ctx.request.body.style, 400, 'geometry style is required');
    ctx.assert(ctx.request.body.geometry_type, 400, 'geometry type is required');

    const geometryStyle = await GeometryStyle.create(Object.assign({}, ctx.request.body ));

    ctx.body = {
      payload: geometryStyle,
    };
  };
}


function searchGeometryStyles(routeConfig={}) {
  const { sequelize } = routeConfig;
  const GeometryStyle = sequelize.model('geometry_style');

  return async function (ctx, next) {

    const condition = {}

    if (ctx.request.query.geometry_type) {
      condition.geometry_type = ctx.request.query.geometry_type;
    }

    const { rows: geometryStyles, count: total } = await GeometryStyle.findAndCountAll({
      limit: ctx.request.query.limit,
      offset: ctx.request.query.skip,
      where: condition,
    });
    ctx.body = {
      payload: geometryStyles,
      meta: { total },
    };
  };
}


function fetchGeometryStyle(routeConfig={}) {
  const { sequelize } = routeConfig;
  const GeometryStyle = sequelize.model('geometry_style');

  return async function (ctx, geometryStyleId) {

    const geometryStyle = await GeometryStyle.findById(geometryStyleId);
    ctx.assert(geometryStyle, 404, 'no geometry style found');

    ctx.body = {
      payload: geometryStyle,
    };
  };
}


function updateGeometryStyle(routeConfig={}) {
  const { sequelize } = routeConfig;
  const GeometryStyle = sequelize.model('geometry_style');

  return async function (ctx, geometryStyleId) {

    ctx.assert(ctx.request.body.style, 400, 'geometry style is required');
    ctx.assert(ctx.request.body.geometry_type, 400, 'geometry type is required');

    const geometryStyle = await GeometryStyle.findById(geometryStyleId);
    ctx.assert(geometryStyle, 400, 'no geometryStyle found');

    await geometryStyle.update(Object.assign({}, ctx.request.body ));

    ctx.body = {
      payload: geometryStyle,
    };
  };
}

function removeGeometryStyle(routeConfig={}) {
  const { sequelize } = routeConfig;
  const GeometryStyle = sequelize.model('geometry_style');

  return async function (ctx, geometryStyleId) {

    const geometryStyle = await GeometryStyle.findById(geometryStyleId);
    ctx.assert(geometryStyle, 400, 'no geometry style found');

    await geometryStyle.destroy();
    ctx.status = 204;
  };
}
