const omit = require('lodash/fp/omit');
const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.createFeature = createFeature;
exports.searchFeatures = searchFeatures;
exports.fetchFeature = fetchFeature;
exports.updateFeature = updateFeature;
exports.removeFeature = removeFeature;


function configRoute(defaultRouteConfig={}) {
  return {
    createFeature: routeConfig => createFeature(merge(defaultRouteConfig, routeConfig)),
    searchFeatures: routeConfig => searchFeatures(merge(defaultRouteConfig, routeConfig)),
    fetchFeature: routeConfig => fetchFeature(merge(defaultRouteConfig, routeConfig)),
    updateFeature: routeConfig => updateFeature(merge(defaultRouteConfig, routeConfig)),
    removeFeature: routeConfig => removeFeature(merge(defaultRouteConfig, routeConfig)),
  };
}


/*

{
    "payload": {
        "id": "8",
        "uuid": "6306d3c5-5f75-4b89-aa78-d8664da4e0a5",
        "cartogram_id": "1",
        "layer_id": "24",
        "geometry_style_id": "4",
        "geometry_type": "Point",
        "geometry": {
            "type": "Point",
            "coordinates": [106, 23]
        }
    }
}

 */
function createFeature(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Cartogram = sequelize.model('cartogram');
  const Feature = sequelize.model('feature');
  const Layer = sequelize.model('layer');
  const GeometryStyle = sequelize.model('geometry_style');
  const Organization = sequelize.model('organization');
  const FeatureField = sequelize.model('feature_field');
  const FeatureProperty = sequelize.model('feature_property');
  const LayerField = sequelize.model('layer_field');
  const LayerFieldOption = sequelize.model('layer_field_option');


  return async function createFeature(ctx) {
    const transaction = await sequelize.transaction();


    try {
      ctx.assert(ctx.request.body.cartogram_id, 400, 'unknown cartogram');
      const cartogram = await Cartogram.findOne({
        where: {
          id: ctx.request.body.cartogram_id,
        },
        include: [
          {
            model: Organization,
            as: 'owner',
          },
        ],
      });
      ctx.assert(cartogram, 400, 'invalid cartogram');
      const organization = cartogram.owner;


      ctx.assert(ctx.request.body.geometry_type, 400, 'geometry type required');


      ctx.assert(ctx.request.body.geometry, 400, 'geometry required');


      ctx.assert(ctx.request.body.layer_id, 400, 'unknown layer');
      const layer = await Layer.findOne({
        where: {
          id: ctx.request.body.layer_id,
        },
        include: [
          {
            model: LayerField,
            as: 'fields',
            include: [
              {
                model: LayerFieldOption,
                as: 'options',
              },
            ],
          },
        ],
      });
      ctx.assert(layer, 400, 'invalid layer');

      const geometryStyleId = ctx.request.body.geometry_style_id;
      ctx.assert((geometryStyleId && geometryStyleId.length !== 36) || ctx.request.body.geometry_style, 400, 'geometry style required');

      let geometryStyle;
      if (geometryStyleId && geometryStyleId.length !== 36) {
        geometryStyle = await GeometryStyle.findById(ctx.request.body.geometry_style_id);
        ctx.assert(geometryStyle, 400, 'geometry style required');
      } else {
        const rawGeometryStyle = ctx.request.body.geometry_style;
        geometryStyle = await GeometryStyle.create(Object.assign({}, rawGeometryStyle, {
          hidden: true,
        }), { transaction });
      }

      const featureUUID = ctx.request.body.uuid;
      ctx.assert(featureUUID, 400, 'uuid required');

      const isUuidConflict = await Feature.findOne({
        where: {
          uuid: featureUUID,
        },
      });
      ctx.assert(!isUuidConflict, 400, 'uuid conflict');

      const feature = await Feature.create(Object.assign({}, ctx.request.body, {
        owner_id: organization.id,
        cartogram_id: cartogram.id,
        layer_id: layer.id,
        geometry_style_id: geometryStyle.id,
        uuid: featureUUID,
      }), { transaction });


      await Promise.all((ctx.request.body.fields || []).map(rawField => FeatureField.create({
        feature_id: feature.id,
        name: rawField.name,
        description: rawField.description,
        data_type: rawField.data_type,
        input_type: rawField.input_type,
      }, { transaction })));


      await Promise.all((ctx.request.body.properties || []).map(rawProperty => {
        // TODO: 如果field是layer内定义的field而且包含options，那么还需要检查属性值是否在options定义的范围内

        return FeatureProperty.create({
          feature_id: feature.id,
          name: rawProperty.name,
          value: rawProperty.value,
        }, { transaction });
      }));

      await transaction.commit();

      ctx.body = {
        payload: feature,
      };
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  };
}


function searchFeatures(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Feature = sequelize.model('feature');
  const Cartogram = sequelize.model('cartogram');
  const Layer = sequelize.model('layer');
  const GeometryStyle = sequelize.model('geometry_style');
  const Organization = sequelize.model('organization');
  const FeatureField = sequelize.model('feature_field');
  const FeatureProperty = sequelize.model('feature_property');
  const Op = sequelize.Op;


  return async function (ctx) {
    const condition = {};

    if (ctx.request.query.cartogram_id) {
      condition.cartogram_id = ctx.request.query.cartogram_id;
    }

    let layer_code = ctx.request.query.layer_code;
    if (layer_code != null && !Array.isArray(layer_code)) {
      layer_code = [layer_code];
    }
    const layerFilter = {};
    if (layer_code) {
      layerFilter.code = {
        [Op.in]: layer_code,
      };
    }


    const { rows: features, count: total } = await Feature.findAndCountAll({
      where: condition,
      include: [
        {
          model: Cartogram,
        },
        {
          model: Organization,
          as: 'owner',
        },
        {
          model: Layer,
          where: layerFilter,
        },
        {
          model: GeometryStyle,
        },
        {
          model: FeatureField,
          as: 'fields',
        },
        {
          model: FeatureProperty,
          as: 'properties',
        },
      ],
    });

    ctx.body = {
      payload: features,
      meta: { total },
    };
  };
}


function fetchFeature(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Feature = sequelize.model('feature');


  return async function (ctx, featureUUID) {
    const feature = await Feature.findById(featureUUID);
    ctx.assert(feature, 404, 'no feature found');
    ctx.body = {
      payload: feature,
    };
  };
}


function updateFeature(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Cartogram = sequelize.model('cartogram');
  const Feature = sequelize.model('feature');
  const Layer = sequelize.model('layer');
  const GeometryStyle = sequelize.model('geometry_style');
  const Organization = sequelize.model('organization');
  const FeatureField = sequelize.model('feature_field');
  const FeatureProperty = sequelize.model('feature_property');
  const LayerField = sequelize.model('layer_field');
  const LayerFieldOption = sequelize.model('layer_field_option');


  return async function (ctx, featureUUID) {
    const transaction = await sequelize.transaction();


    try {
      ctx.assert(ctx.request.body.cartogram_id, 400, 'unknown cartogram');
      const cartogram = await Cartogram.findOne({
        where: {
          id: ctx.request.body.cartogram_id,
        },
        include: [
          {
            model: Organization,
            as: 'owner',
          },
        ],
      });
      ctx.assert(cartogram, 400, 'invalid cartogram');
      const organization = cartogram.owner;


      ctx.assert(ctx.request.body.geometry_type, 400, 'geometry type required');


      ctx.assert(ctx.request.body.geometry, 400, 'geometry required');


      ctx.assert(ctx.request.body.layer_id, 400, 'unknown layer');
      const layer = await Layer.findOne({
        where: {
          id: ctx.request.body.layer_id,
        },
        include: [
          {
            model: LayerField,
            as: 'fields',
            include: [
              {
                model: LayerFieldOption,
                as: 'options',
              },
            ],
          },
        ],
      });
      ctx.assert(layer, 400, 'invalid layer');


      const geometryStyleId = ctx.request.body.geometry_style_id;
      ctx.assert((geometryStyleId && geometryStyleId.length !== 36) || ctx.request.body.geometry_style, 400, 'geometry style required');

      let geometryStyle;
      if (geometryStyleId && geometryStyleId.length !== 36) {
        geometryStyle = await GeometryStyle.findById(ctx.request.body.geometry_style_id);
        ctx.assert(geometryStyle, 400, 'geometry style required');
      } else {
        const rawGeometryStyle = ctx.request.body.geometry_style;
        geometryStyle = await GeometryStyle.create(Object.assign({}, omit(['id'], rawGeometryStyle), {
          hidden: true,
        }), { transaction });
      }


      const feature = await Feature.findOne({
        where: {
          owner_id: organization.id,
          uuid: featureUUID,
        },
      });
      await feature.update({
        layer_id: layer.id,
        geometry_style_id: geometryStyle.id,
        geometry: ctx.request.body.geometry,
      }, { transaction });


      // 移除旧的字段定义
      await FeatureField.destroy({
        where: {
          feature_id: feature.id,
        },
        force: true,
        transaction,
      });

      // 插入新的字段定义
      await Promise.all((ctx.request.body.fields || []).map(rawField => FeatureField.create({
        feature_id: feature.id,
        name: rawField.name,
        description: rawField.description,
        data_type: rawField.data_type,
        input_type: rawField.input_type,
      }, { transaction })));


      // 移除旧的属性
      await FeatureProperty.destroy({
        where: {
          feature_id: feature.id,
        },
        force: true,
        transaction,
      });

      // 插入新的属性
      await Promise.all((ctx.request.body.properties || []).map(rawProperty => {
        // TODO: 如果field是layer内定义的field而且包含options，那么还需要检查属性值是否在options定义的范围内

        return FeatureProperty.create({
          feature_id: feature.id,
          name: rawProperty.name,
          value: rawProperty.value,
        }, { transaction });
      }));

      await transaction.commit();

      ctx.body = {
        payload: feature,
      };
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  };
}

function removeFeature(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Feature = sequelize.model('feature');
  const Layer = sequelize.model('layer');
  const GeometryStyle = sequelize.model('geometry_style');
  const FeatureField = sequelize.model('feature_field');
  const FeatureProperty = sequelize.model('feature_property');


  return async function (ctx, featureUUID) {
    // TODO: 判断用户是否有权删除

    const transaction = await sequelize.transaction();

    const feature = await Feature.findOne({
      where: {
        uuid: featureUUID,
      },
      include: [
        {
          model: Layer,
        },
        {
          model: GeometryStyle,
        },
      ],
    });
    if (feature) {
      try {
        await feature.destroy({ transaction });

        if (feature.geometry_style_id !== feature.layer.geometry_style_id) {
          await GeometryStyle.destroy({
            where: {
              id: feature.geometry_style_id,
            },
          });
        }
        await FeatureProperty.destroy({
          where: {
            feature_id: feature.id,
          },
        });
        await FeatureField.destroy({
          where: {
            feature_id: feature.id,
          },
        });

        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
      }
    }
    ctx.status = 204;
  };
}
