exports.beforeCreateCartogramRoute = beforeCreateCartogramRoute;
exports.createCartogramRoute = createCartogramRoute;
exports.searchCartogramRoutes = searchCartogramRoutes;
exports.beforeUpdateCartogramRoute = beforeUpdateCartogramRoute;
exports.updateCartogramRoute = updateCartogramRoute;
exports.beforeRemoveCartogramRoute = beforeRemoveCartogramRoute;
exports.removeCartogramRoute = removeCartogramRoute;


function beforeCreateCartogramRoute(config) {
  const { sequelize } = config;
  const CartogramCollection = sequelize.model('cartogram_collection');
  const CartogramRoute = sequelize.model('cartogram_route');
  const Feature = sequelize.model('feature');


  return async function (ctx, next) {
    const {
      cartogram_collection_id,
      from_feature_id,
      to_feature_id,
      highway,
      oneway,
    } = ctx.request.body;

    ctx.assert(cartogram_collection_id, 400, 'cartogram_collection_id is required');

    const cartogramCollection = ctx.state.cartogramCollection = await CartogramCollection.findById(cartogram_collection_id);
    ctx.assert(cartogramCollection, 400, '无效地图集合');

    const hasPermissionOfCartogramCollection = await cartogramCollection.hasPermission(ctx.state.user.id);
    ctx.assert(hasPermissionOfCartogramCollection, 403, '没有操作权限');

    ctx.assert(from_feature_id, 400, 'from_feature_id is required');

    const fromFeature = ctx.state.fromFeature = await Feature.findById(from_feature_id);
    ctx.assert(fromFeature, 400, '无效起始位置');

    const hasPermissionOfFromFeature = await fromFeature.hasPermission(ctx.state.user.id);
    ctx.assert(hasPermissionOfFromFeature, 400, '无效起始位置');

    ctx.assert(to_feature_id, 400, 'to_feature_id is required');

    const toFeature = ctx.state.toFeature = await Feature.findById(to_feature_id);
    ctx.assert(toFeature, 400, '无效目标位置');

    const hasPermissionOfToFeature = await toFeature.hasPermission(ctx.state.user.id);
    ctx.assert(hasPermissionOfToFeature, 400, '无效目标位置');

    const _highway = ctx.state.highway = highway || 'both';
    ctx.assert(CartogramRoute.rawAttributes.highway.values.includes(_highway), '400', '无效道路类别');

    const _oneway = ctx.state.oneway = oneway || 'no';
    ctx.assert(CartogramRoute.rawAttributes.oneway.values.includes(_oneway), '400', '无效单行道参数');

    await next();
  };
}


function createCartogramRoute(config) {
  const { sequelize } = config;
  const CartogramCollection = sequelize.model('cartogram_collection');
  const CartogramRoute = sequelize.model('cartogram_route');
  const Feature = sequelize.model('feature');
  const Layer = sequelize.model('layer');
  const FeatureProperty = sequelize.model('feature_property');
  const Cartogram = sequelize.model('cartogram');


  return async function createCartogramRoute(ctx) {
    const {
      cartogramCollection,
      fromFeature,
      toFeature,
      highway,
      oneway,
    } = ctx.state;

    const cartogramRoute = await CartogramRoute.create({
      cartogram_collection_id: cartogramCollection.id,
      from_feature_id: fromFeature.id,
      to_feature_id: toFeature.id,
      highway,
      oneway,
    });

    await cartogramRoute.reload({
      include: [
        {
          model: CartogramCollection,
        },
        {
          model: Feature,
          as: 'from_feature',
          include: [
            {
              model: Cartogram,
            },
            {
              model: Layer,
            },
            {
              model: FeatureProperty,
              as: 'properties',
            },
          ],
        },
        {
          model: Feature,
          as: 'to_feature',
          include: [
            {
              model: Cartogram,
            },
            {
              model: Layer,
            },
            {
              model: FeatureProperty,
              as: 'properties',
            },
          ],
        },
      ],
    });

    ctx.body = {
      payload: cartogramRoute,
    };
  };
}


function searchCartogramRoutes(config) {
  const { sequelize } = config;
  const CartogramCollection = sequelize.model('cartogram_collection');
  const CartogramRoute = sequelize.model('cartogram_route');
  const Feature = sequelize.model('feature');
  const Layer = sequelize.model('layer');
  const FeatureProperty = sequelize.model('feature_property');
  const Cartogram = sequelize.model('cartogram');


  return async function (ctx) {
    const condition = {};

    if (ctx.request.query.cartogram_collection_id) {
      condition.cartogram_collection_id = ctx.request.query.cartogram_collection_id;
    }

    const { rows: cartogramRoutes, count: total } = await CartogramRoute.findAndCountAll({
      where: condition,
      limit: ctx.request.query.limit,
      offset: ctx.request.query.skip,
      include: [
        {
          model: CartogramCollection,
        },
        {
          model: Feature,
          as: 'from_feature',
          include: [
            {
              model: Cartogram,
            },
            {
              model: Layer,
            },
            {
              model: FeatureProperty,
              as: 'properties',
            },
          ],
        },
        {
          model: Feature,
          as: 'to_feature',
          include: [
            {
              model: Cartogram,
            },
            {
              model: Layer,
            },
            {
              model: FeatureProperty,
              as: 'properties',
            },
          ],
        },
      ],
    });
    ctx.body = {
      payload: cartogramRoutes.map(cartogramToJSON),
      meta: { total },
    };
  };
}


function beforeUpdateCartogramRoute(config) {
  const { sequelize } = config;
  const CartogramRoute = sequelize.model('cartogram_route');
  const Feature = sequelize.model('feature');
  const Op = sequelize.Op;


  return async function (ctx, cartogramRouteId, next) {
    const cartogramRoute = ctx.state.cartogramRoute = await CartogramRoute.findById(cartogramRouteId);
    ctx.assert(cartogramRoute, 400, 'invalid cartogram_route_id');

    const hasPermissionOfCartogramRoute = await cartogramRoute.hasPermission(ctx.state.user.id);
    ctx.assert(hasPermissionOfCartogramRoute, 400, 'invalid cartogram_route_id');

    const {
      from_feature_id,
      to_feature_id,
      highway,
      oneway,
    } = ctx.request.body;
    ctx.assert(from_feature_id, 400, 'from_feature_id is required');

    const fromFeature = ctx.state.fromFeature = await Feature.findById(from_feature_id);
    ctx.assert(fromFeature, 400, '无效起始位置');

    const hasPermissionOfFromFeature = await fromFeature.hasPermission(ctx.state.user.id);
    ctx.assert(hasPermissionOfFromFeature, 400, '无效起始位置');

    ctx.assert(to_feature_id, 400, 'to_feature_id is required');

    const toFeature = ctx.state.toFeature = await Feature.findById(to_feature_id);
    ctx.assert(toFeature, 400, '无效目标位置');

    const hasPermissionOfToFeature = await toFeature.hasPermission(ctx.state.user.id);
    ctx.assert(hasPermissionOfToFeature, 400, '无效目标位置');

    const _highway = ctx.state.highway = highway || 'both';
    ctx.assert(CartogramRoute.rawAttributes.highway.values.includes(_highway), '400', '无效道路类别');

    const _oneway = ctx.state.oneway = oneway || 'no';
    ctx.assert(CartogramRoute.rawAttributes.oneway.values.includes(_oneway), '400', '无效单行道参数');

    const isRouteConflict = await CartogramRoute.findOne({
      where: {
        id: {
          [Op.ne]: CartogramRoute.id,
        },
        cartogram_collection_id: CartogramRoute.cartogram_collection_id,
        from_feature_id: fromFeature.id,
        to_feature_id: toFeature.id,
      },
    });
    ctx.assert(!isRouteConflict, 400, `a route from ${fromFeature.id} to ${toFeature.id} already exists`);

    await next();
  };
}


function updateCartogramRoute(config) {
  return async function (ctx, cartogramRouteId) {
    const {
      cartogramRoute,
      fromFeature,
      toFeature,
      highway,
      oneway,
    } = ctx.state;

    await cartogramRoute.update({
      from_feature_id: fromFeature.id,
      to_feature_id: toFeature.id,
      highway,
      oneway,
    });

    ctx.body = {
      payload: cartogramRoute,
    };
  };
}


function beforeRemoveCartogramRoute(config) {
  const { sequelize } = config;
  const CartogramRoute = sequelize.model('cartogram_route');


  return async function (ctx, cartogramRouteId, next) {
    const cartogramRoute = ctx.state.cartogramRoute = await CartogramRoute.findById(cartogramRouteId);
    ctx.assert(cartogramRoute, 204);

    const hasPermissionOfCartogramRoute = await cartogramRoute.hasPermission(ctx.state.user.id);
    ctx.assert(hasPermissionOfCartogramRoute, 204);

    await next();
  };
}


function removeCartogramRoute(config) {
  return async function (ctx, cartogramRouteId) {
    if (ctx.state.cartogramRoute) {
      await ctx.state.cartogramRoute.destroy();
    }

    ctx.status = 204;
  };
}


function cartogramToJSON(cartogramRoute) {
  const json = cartogramRoute.toJSON();

  return {
    ...json,
    from_feature: cartogramRoute.from_feature,
    to_feature: cartogramRoute.to_feature,
  };
}
