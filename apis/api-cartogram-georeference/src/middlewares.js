const turf = require('@turf/turf');
const merge = require('lodash/fp/merge');
const sizeOf = require('image-size');
const axios = require('axios');


exports = module.exports = configRoute;
exports.fetchCartogramGeoreference = fetchCartogramGeoreference;
exports.updateCartogramGeoreference = updateCartogramGeoreference;


function configRoute(defaultRouteConfig={}) {
  return {
    fetchCartogramGeoreference: routeConfig => fetchCartogramGeoreference(merge(defaultRouteConfig, routeConfig)),
    updateCartogramGeoreference: routeConfig => updateCartogramGeoreference(merge(defaultRouteConfig, routeConfig)),
  };
}

function fetchCartogramGeoreference(routeConfig) {
  const { sequelize, storageApiUri } = routeConfig;
  const Cartogram = sequelize.model('cartogram');
  const CartogramGeoreference = sequelize.model('cartogram_georeference');
  const Op = sequelize.Op;


  return async function (ctx, cartogramId) {

    const myOrganizationIds = sequelize.dialect.QueryGenerator.selectQuery('organization_member', {
      attributes: ['organization_id'],
      where: {
        user_id: ctx.state.user.id,
      },
    }).slice(0, -1);


    const cartogram = await Cartogram.findOne({
      where: {
        id: cartogramId,
        owner_id: {
          [Op.in]: sequelize.literal(`(${myOrganizationIds})`),
        }
      },
    });
    ctx.assert(cartogram, 404, '地图不存在或者没有操作权限');
    ctx.assert(cartogram.diagram, 404, '地图不包含底图');

    let cartogramGeoreference = await CartogramGeoreference.findOne({
      where: {
        cartogram_id: cartogram.id,
      },
      include: [
        {
          model: Cartogram,
          as: 'cartogram',
        },
      ],
    });

    if (!cartogramGeoreference) {
      const { location, diagram } = cartogram;
      const diagramUrl = `${storageApiUri}/${diagram}`;
      const defaults = await getBoundFromCartogram(location, diagramUrl);

      await CartogramGeoreference.create({
        ...defaults,
        cartogram_id: cartogram.id,
      });
      cartogramGeoreference = await CartogramGeoreference.findOne({
        where: {
          cartogram_id: cartogram.id,
        },
        include: [
          {
            model: Cartogram,
            as: 'cartogram',
          },
        ],
      });
    }

    ctx.body = {
      payload: cartogramGeoreference,
    };
  };
}

function updateCartogramGeoreference(configRoute={}) {
  const { sequelize, storageApiUri } = configRoute;
  const Cartogram = sequelize.model('cartogram');
  const CartogramGeoreference = sequelize.model('cartogram_georeference');
  const Op = sequelize.Op;


  return async function (ctx, cartogramId) {

    const myOrganizationIds = sequelize.dialect.QueryGenerator.selectQuery('organization_member', {
      attributes: ['organization_id'],
      where: {
        user_id: ctx.state.user.id,
      },
    }).slice(0, -1);


    const cartogram = await Cartogram.findOne({
      where: {
        id: cartogramId,
        owner_id: {
          [Op.in]: sequelize.literal(`(${myOrganizationIds})`),
        }
      },
    });
    ctx.assert(cartogram, 400, '地图不存在或者没有操作权限');
    ctx.assert(cartogram.diagram, 400, '地图不包含底图');

    let cartogramGeoreference = await CartogramGeoreference.findOne({
      where: {
        cartogram_id: cartogram.id,
      },
    });
    if (!cartogramGeoreference) {
      const { location, diagram } = cartogram;
      const diagramUrl = `${storageApiUri}/${diagram}`;
      const defaults = await getBoundFromCartogram(location, diagramUrl);

      await CartogramGeoreference.create({
        ...defaults,
        cartogram_id: cartogram.id,
      });
      cartogramGeoreference = await CartogramGeoreference.findOne({
        where: {
          cartogram_id: cartogram.id,
        },
        include: [
          {
            model: Cartogram,
            as: 'cartogram',
          },
        ],
      });
    }

    const southWest = ctx.request.body.south_west || ctx.request.body.southWest;
    const southEast = ctx.request.body.south_east || ctx.request.body.southEast;
    const northEast = ctx.request.body.north_east || ctx.request.body.northEast;
    const northWest = ctx.request.body.north_west || ctx.request.body.northWest;

    await cartogramGeoreference.update({
      southWest: southWest,
      southEast: southEast,
      northEast: northEast,
      northWest: northWest,
      south_west: southWest,
      south_east: southEast,
      north_east: northEast,
      north_west: northWest,
    });


    ctx.body = {
      payload: cartogramGeoreference,
    };
  };
}

async function getBoundFromCartogram(cartogramLocation, cartogramDiagramUrl) {
  const { width, height } = await getDiagramSize(cartogramDiagramUrl);
  const distance = Math.hypot(width, height) / 1000;
  const angle = Math.atan(width / height) * 180 / Math.PI;

  const northWest = turf.getGeom(turf.destination(cartogramLocation, distance, -angle, { units: 'kilometers' }));
  const southWest = turf.getGeom(turf.destination(cartogramLocation, distance, angle, { units: 'kilometers' }));
  const southEast = turf.getGeom(turf.destination(cartogramLocation, distance, 180 - angle, { units: 'kilometers' }));
  const northEast = turf.getGeom(turf.destination(cartogramLocation, distance, 180 + angle, { units: 'kilometers' }));

  return {
    northWest,
    southWest,
    southEast,
    northEast,
    north_west: northWest,
    south_west: southWest,
    south_east: southEast,
    north_east: northEast,
  };
}

async function getDiagramSize(diagramUrl) {
  const res = await axios.get(diagramUrl, {
    responseType: 'arraybuffer',
  });
  const dimensions = sizeOf(res.data);
  return dimensions;
}
