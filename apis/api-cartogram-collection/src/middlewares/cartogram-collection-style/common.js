const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.prepareCartogramCollection = prepareCartogramCollection;


function configRoute(defaultRouteConfig={}) {
  return {
    prepareCartogramCollection: routeConfig => prepareCartogramCollection(merge(defaultRouteConfig, routeConfig)),
  };
}


function prepareCartogramCollection(routeConfig={}) {
  const { sequelize } = routeConfig;
  const CartogramCollection = sequelize.model('cartogram_collection');
  const CartogramGeoreference = sequelize.model('cartogram_georeference');
  const CartogramRoute = sequelize.model('cartogram_route');
  const Cartogram = sequelize.model('cartogram');
  const Feature = sequelize.model('feature');
  const Layer = sequelize.model('layer');
  const GeometryStyle = sequelize.model('geometry_style');
  const FeatureProperty = sequelize.model('feature_property');


  return async function (ctx, cartogramCollectionId, next) {
    const cartogramCollection = ctx.state.cartogramCollection = await CartogramCollection.findById(cartogramCollectionId, {
      attributes: [
        'id',
        'name',
        'updated_at',
      ],
      include: [
        {
          model: Cartogram,
          as: 'cartograms',
          attributes: [
            'id',
            'name',
            'location',
            'length',
            'width',
            'height',
            'floor_label',
            'floor_index',
            'floor_number',
            'updated_at',
          ],
          include: [
            {
              model: CartogramGeoreference,
              as: 'georeference',
            },
            {
              model: Feature,
              as: 'features',
              attributes: [
                'id',
                'layer_id',
                'geometry_style_id',
                'uuid',
                'geometry',
                'updated_at',
              ],
              include: [
                {
                  model: Layer,
                },
                {
                  model: GeometryStyle,
                  attributes: [
                    'id',
                    'style',
                    'updated_at',
                  ],
                },
                {
                  model: FeatureProperty,
                  as: 'properties',
                  attributes: [
                    'id',
                    'feature_id',
                    'name',
                    'value',
                    'updated_at',
                  ],
                }
              ],
            },
          ],
        },
        {
          model: CartogramRoute,
          as: 'routes',
          attributes: [
            'id',
            'oneway',
            'highway',
            'updated_at',
            'cartogram_collection_id',
            'from_cartogram_id',
            'to_cartogram_id',
            'from_feature_id',
            'to_feature_id',
          ],
          include: [
            {
              model: Feature,
              as: 'from_feature',
              attributes: [
                'id',
                'geometry',
              ],
              include: [
                {
                  model: Cartogram,
                  attributes: [
                    'id',
                    'name',
                  ],
                },
              ],
            },
            {
              model: Feature,
              as: 'to_feature',
              attributes: [
                'id',
                'geometry',
              ],
              include: [
                {
                  model: Cartogram,
                  attributes: [
                    'id',
                    'name',
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    ctx.assert(cartogramCollection, 404, 'no cartogram collection found');

    await next();
  };
}


// function prepareLayersForEachCartogramInCartogramCollection(routeConfig={}) {
//   return async function (ctx, cartogramCollectionId, next) {
//     const layers = await Layer.findAll();
//     ctx.state.layers = layers.sort((a, b) => a.sequence - b.sequence);
//
//     await next();
//   };
// }
