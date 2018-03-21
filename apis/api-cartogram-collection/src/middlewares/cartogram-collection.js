const identity = require('lodash/identity');
const omit = require('lodash/fp/omit');
const moment = require('moment');
const difference = require('lodash/difference');
const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.authCreateCartogramCollection = authCreateCartogramCollection;
exports.createCartogramCollection = createCartogramCollection;
exports.searchCartogramCollections = searchCartogramCollections;
exports.fetchCartogramCollection = fetchCartogramCollection;
exports.updateCartogramCollection = updateCartogramCollection;
exports.removeCartogramCollection = removeCartogramCollection;


function configRoute(defaultRouteConfig={}) {
  return {
    authCreateCartogramCollection: routeConfig => authCreateCartogramCollection(merge(defaultRouteConfig, routeConfig)),
    createCartogramCollection: routeConfig => createCartogramCollection(merge(defaultRouteConfig, routeConfig)),
    searchCartogramCollections: routeConfig => searchCartogramCollections(merge(defaultRouteConfig, routeConfig)),
    fetchCartogramCollection: routeConfig => fetchCartogramCollection(merge(defaultRouteConfig, routeConfig)),
    updateCartogramCollection: routeConfig => updateCartogramCollection(merge(defaultRouteConfig, routeConfig)),
    removeCartogramCollection: routeConfig => removeCartogramCollection(merge(defaultRouteConfig, routeConfig)),
  };
}



function authCreateCartogramCollection(routeConfig={}) {
  const { sequelize } = routeConfig;
  const CartogramCollection = sequelize.model('cartogram_collection');
  const Organization = sequelize.model('organization');
  const Plan = sequelize.model('plan');
  const User = sequelize.model('user');

  return async function authCreateCartogramCollection(ctx, next) {
    const organization = ctx.request.body.organization_id
      ? await Organization.findOne({
        where: {
          id: ctx.request.body.organization_id,
        },
        include: [
          {
            model: Plan,
          },
          {
            model: User,
            as: 'owner',
          },
        ],
      })
      : await Organization.findOne({
        where: {
          owner_id: ctx.state.user.id,
          personal: true,
        },
        include: [
          {
            model: Plan,
          },
          {
            model: User,
            as: 'owner',
          },
        ],
      });

    ctx.assert(organization, 400, 'organization not found');
    if(organization.plan) {
      ctx.assert(moment().isBefore(organization.plan_expired_at), 400, '方案已过期');
    }

    const total = await CartogramCollection.count({
      where: {
        owner_id: organization.id,
      },
    });
    const limit = organization.plan == null ? 1 : organization.plan.project_count;

    ctx.assert(total < limit, 400, `该账号当前最多只能创建${limit}个项目`);
    ctx.state.organization = organization;
    return next();
  };
}

function createCartogramCollection(routeConfig={}) {
  const { sequelize } = routeConfig;
  const CartogramCollection = sequelize.model('cartogram_collection');

  return async function createCartogramCollection(ctx) {
    ctx.assert(ctx.request.body.name, 412, 'name未填写');
    ctx.assert(Array.isArray(ctx.request.body.cartogram_ids), 412, '不是一个有效的地图数组');

    const cartogramsQuery = ctx.request.body.cartogram_ids.filter(identity)
        .map(findAvailableCartogram(routeConfig));
    const cartograms = await Promise.all(cartogramsQuery);
    ctx.assert(cartograms.every(identity), 412, '包含无效地图Id');

    const cartogramCollection = await CartogramCollection.create(Object.assign({}, ctx.request.body, {
      owner_id: ctx.state.organization.id,
    }));

    await cartogramCollection.addCartograms(cartograms);

    ctx.body = {
      payload: cartogramCollection,
    };
  };
}


function findAvailableCartogram(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Cartogram = sequelize.model('cartogram');

  return cartogramId => Cartogram.find({
    where: {
      id: cartogramId,
    }
  });
}


function searchCartogramCollections(routeConfig={}) {
  const { sequelize } = routeConfig;
  const CartogramCollection = sequelize.model('cartogram_collection');
  const Organization = sequelize.model('organization');
  const Cartogram = sequelize.model('cartogram');

  return async function (ctx) {
    const organization = ctx.request.query.organization_id
      ? await Organization.findById(ctx.request.query.organization_id)
      : await Organization.findOne({
        where: {
          owner_id: ctx.state.user.id,
          personal: true,
        },
      });
    const { rows: cartogramCollections, count: total } = await CartogramCollection.findAndCountAll({
      where: {
        owner_id: organization.id,
      },
      include: [
        {
          model: Cartogram,
          as: 'cartograms',
        },
        {
          model: Organization,
          as: 'owner',
        },
      ],
      limit: ctx.request.query.limit,
      offset: ctx.request.query.skip,
    });

    ctx.body = {
      payload: cartogramCollections,
      meta: { total },
    };
  };
}

function fetchCartogramCollection(routeConfig={}) {
  const { sequelize } = routeConfig;
  const CartogramCollection = sequelize.model('cartogram_collection');
  const Organization = sequelize.model('organization');
  const Cartogram = sequelize.model('cartogram');

  return async function (ctx, cartogramCollectionId) {

    const cartogramCollection = await CartogramCollection.findById(cartogramCollectionId, {
      include: [
        {
          model: Cartogram,
          as: 'cartograms',
        },
        {
          model: Organization,
          as: 'owner',
        },
      ],
    });
    ctx.assert(cartogramCollection, 404, 'no cartogramCollectio');

    const hasPermission = await cartogramCollection.hasPermission(ctx.state.user.id);
    ctx.assert(hasPermission, 404);

    ctx.body = {
      payload: cartogramCollection,
    };
  };
}


function updateCartogramCollection(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Op = sequelize.Op;
  const CartogramCollection = sequelize.model('cartogram_collection');
  const Cartogram = sequelize.model('cartogram');

  return async function (ctx, cartogramCollectionId) {
    const cartogramCollection = await CartogramCollection.findById(cartogramCollectionId);
    ctx.assert(cartogramCollection, 400, 'no cartogramCollection found');

    ctx.assert(ctx.request.body.name, 412, 'name未填写');
    ctx.assert(Array.isArray(ctx.request.body.cartogram_ids), 412, '不是一个有效的地图数组');

    const cartogramsQuery = ctx.request.body.cartogram_ids.filter(identity).map(findAvailableCartogram(routeConfig));
    const cartograms = await Promise.all(cartogramsQuery);
    ctx.assert(cartograms.every(identity), 412, '包含无效地图Id');

    const existCartograms = await cartogramCollection.getCartograms();
    const ids = existCartograms.map(cartogram => cartogram.id);
    const newIds = difference(ctx.request.body.cartogram_ids, ids);
    const delIds = difference(ids, ctx.request.body.cartogram_ids);

    const transaction = await sequelize.transaction();
    try {
      if(newIds && newIds.length > 0) {
        const newCartograms = await Cartogram.findAll({
          where: {
            id: {
              [Op.in]: newIds,
            }
          }
        });
        await cartogramCollection.addCartograms(newCartograms, { transaction });
      }

      if(delIds && delIds > 0) {
        const delCartograms = await Cartogram.findAll({
          where: {
            id: {
              [Op.in]: delIds,
            }
          }
        });
        await cartogramCollection.removeCartograms(delCartograms, { transaction });
      }

      await cartogramCollection.update(
        Object.assign({},
          cartogramCollection,
          omit(['id', 'owner_id'])(ctx.request.body)
        ),
        { transaction }
      );

      await transaction.commit();

      ctx.body = {
        payload: cartogramCollection,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  };
}


function removeCartogramCollection(routeConfig={}) {
  const { sequelize } = routeConfig;
  const CartogramCollection = sequelize.model('cartogram_collection');

  return async function (ctx, cartogramCollectionId) {

    const cartogramCollection = await CartogramCollection.findById(cartogramCollectionId);
    ctx.assert(cartogramCollection, 400, 'no cartogramCollection found');

    await cartogramCollection.destroy();
    ctx.status = 204;
  };
}
