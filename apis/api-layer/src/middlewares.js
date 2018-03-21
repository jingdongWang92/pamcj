const array = require('lodash/array');
const tinycolor = require('tinycolor2');
const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.createLayer = createLayer;
exports.searchLayers = searchLayers;
exports.fetchLayer = fetchLayer;
exports.updateLayer = updateLayer;
exports.removeLayer = removeLayer;


function configRoute(defaultRouteConfig={}) {
  return {
    createLayer: routeConfig => createLayer(merge(defaultRouteConfig, routeConfig)),
    searchLayers: routeConfig => searchLayers(merge(defaultRouteConfig, routeConfig)),
    fetchLayer: routeConfig => fetchLayer(merge(defaultRouteConfig, routeConfig)),
    updateLayer: routeConfig => updateLayer(merge(defaultRouteConfig, routeConfig)),
    removeLayer: routeConfig => removeLayer(merge(defaultRouteConfig, routeConfig)),
  };
}


/*

{
	"name": "厕所",
	"geometry_type": "Point",
	"code": "toil78991287999e1qwe2t13412331134",
	"geometry_style_id": 3,
	"fields": [
		{
			"name": "gender",
			"description": "性别",
			"data_type": "string",
			"input_type": "select",
			"options": [
				{
					"name": "男厕所",
					"value": "male"
				},
				{
					"name": "女厕所",
					"value": "female"
				}
			]
		},
		{
			"name": "cell_count",
			"description": "坑的数量",
			"data_type": "number",
			"input_type": "number",
			"options": [
				{
					"name": "7坑",
					"value": 7
				},
				{
					"name": "13坑",
					"value": 13
				}
			]
		},
		{
			"name": "mobility_difficulty",
			"description": "是否方便行动不便人士使用",
			"data_type": "boolean",
			"input_type": "radio",
			"options": [
				{
					"name": "支持",
					"value": true
				},
				{
					"name": "不支持",
					"value": false
				}
			]
		}
	]
}

 */
function createLayer(routeConfig={}) {
  const { sequelize } = routeConfig;

  const Layer = sequelize.model('layer');
  const GeometryStyle = sequelize.model('geometry_style');
  const Organization = sequelize.model('organization');
  const LayerField = sequelize.model('layer_field');
  const LayerFieldOption = sequelize.model('layer_field_option');


  return async function createLayer(ctx) {
    let organization;
    if (ctx.request.body.owner_id) {
      organization = await Organization.findOne({
        where: {
          id: ctx.request.body.owner_id,
        },
      });
    } else {
      organization = await Organization.findOne({
        where: {
          personal: true,
          owner_id: ctx.state.user.id,
        },
      });
    }
    ctx.assert(organization, 400, 'owner id is required');
    ctx.assert(ctx.request.body.code, 400, 'code is required');


    const geometryType = ctx.request.body.geometry_type;
    ctx.assert(['Point', 'Curve', 'Surface'].includes(geometryType), 400, 'invalid geometry type');


    const isCreatedBySystem = ctx.state.user.role === 'immortal' && !!ctx.request.body.is_created_by_system;


    let isCodeExists;
    if (isCreatedBySystem) {
      isCodeExists = await Layer.findOne({
        where: {
          is_created_by_system: true,
          code: ctx.request.body.code,
        },
      });
    } else {
      isCodeExists = await Layer.findOne({
        where: {
          is_created_by_system: false,
          code: ctx.request.body.code,
          owner_id: organization.id,
        },
      });
    }
    ctx.assert(!isCodeExists, 400, 'layer code already exists');


    const transaction = await sequelize.transaction();
    try {
      const geometryStyle = await GeometryStyle.create({
        geometry_type: ctx.request.body.geometry_type,
        style: initGeometryStyle(ctx.request.body.geometry_type),
      }, { transaction });

      const layer = await Layer.create(Object.assign({}, ctx.request.body, {
        owner_id: organization.id,
        name: ctx.request.body.name || ctx.request.body.code,
        geometry_style_id: geometryStyle.id,
        is_created_by_system: isCreatedBySystem,
      }), { transaction });


      await Promise.all((ctx.request.body.fields || []).map(async rawField => {
        const field = await LayerField.create({
          layer_id: layer.id,
          name: rawField.name,
          description: rawField.description,
          data_type: rawField.data_type,
          input_type: rawField.input_type,
          default_value: rawField.default_value,
        }, { transaction });

        await Promise.all((rawField.options || []).map(async rawOption => {
          await LayerFieldOption.create({
            layer_field_id: field.id,
            name: rawOption.name,
            value: rawOption.value,
          }, { transaction });
        }));
      }));
      await transaction.commit();

      ctx.body = {
        payload: layer,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  };
}



function searchLayers(routeConfig={}) {
  const { sequelize } = routeConfig;

  const Op = sequelize.Op;
  const Layer = sequelize.model('layer');
  const GeometryStyle = sequelize.model('geometry_style');
  const Organization = sequelize.model('organization');
  const LayerField = sequelize.model('layer_field');
  const LayerFieldOption = sequelize.model('layer_field_option');


  return async function (ctx, next) {
    const myOrganization = await Organization.findOne({
      where: {
        owner_id: ctx.state.user.id,
        personal: true,
      },
    });

    const { rows: layers, count: total } = await Layer.findAndCountAll({
      where: {
        [Op.or]: [
          {
            owner_id: myOrganization.id,
          },
          {
            is_created_by_system: true,
          },
        ],
      },
      limit: ctx.request.query.limit,
      offset: ctx.request.query.skip,
      include: [
        {
          model: GeometryStyle,
          as: 'geometry_style',
        },
        {
          model: Organization,
          as: 'owner',
        },
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
    ctx.body = {
      payload: layers,
      meta: { total },
    };
  };
}


function fetchLayer(routeConfig={}) {
  const { sequelize } = routeConfig;

  const Layer = sequelize.model('layer');
  const LayerField = sequelize.model('layer_field');
  const LayerFieldOption = sequelize.model('layer_field_option');


  return async function (ctx, layerId) {
    const layer = await Layer.findById(layerId, {
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
    ctx.assert(layer, 404, 'no layer found');

    ctx.body = {
      payload: layer,
    };
  };
}


function updateLayer(routeConfig={}) {
  const { sequelize } = routeConfig;

  const Layer = sequelize.model('layer');
  const LayerField = sequelize.model('layer_field');
  const LayerFieldOption = sequelize.model('layer_field_option');
  const OrganizationMember = sequelize.model('organization_member');


  return async function (ctx, layerId) {
    const layer = await Layer.findById(layerId);
    ctx.assert(layer, 400, 'no layer found');


    if (layer.is_created_by_system) {
      // 如果是系统图层，那么只有超级用户才可以修改
      ctx.assert(layer.is_created_by_system && ctx.state.user.role === 'immortal', 403);
    } else {
      // 或者用户是此图层所属组织的成员
      const layerOwnerMember = await OrganizationMember.findOne({
        organization_id: layer.owner_id,
        user_id: ctx.state.user.id,
      });
      ctx.assert(layerOwnerMember.role, 403);
    }


    const transaction = await sequelize.transaction();

    try {
      const sequence = Number.parseInt(ctx.request.body.sequence, 10);
      await layer.update({
        name: ctx.request.body.name || ctx.request.body.code,
        sequence: sequence || 0,
      }, { transaction });


      //delete layer fields
      const layerFields = await LayerField.findAll({
        where: {
          layer_id: layer.id,
        },
      });
      await Promise.all((layerFields || []).map(async field => {
        const index = array.findIndex(ctx.request.body.fields, {id: field.id});
        if(index === -1) {
          await field.destroy({ transaction });
        }
      }));


      await Promise.all((ctx.request.body.fields || []).map(async rawField => {
        // 1. 移除相关联的 layerFieldOption 条目
        await LayerFieldOption.destroy({
          where: {
            layer_field_id: rawField.id,
          },
          transaction,
        });

        // 2. 移除旧的 layerField 条目
        await LayerField.destroy({
          where: {
            layer_id: layer.id,
            id: rawField.id,
          },
          transaction,
        });

        // 3. 创建新的 layerField 条目
        const layerField = await LayerField.create({
          layer_id: layer.id,
          name: rawField.name,
          description: rawField.description,
          data_type: rawField.data_type,
          input_type: rawField.input_type,
          default_value: rawField.default_value,
        }, { transaction });

        // 4. 创建相关联的 layerFieldOption 条目
        await Promise.all((rawField.options || []).map(rawOption => {
          return LayerFieldOption.create({
            layer_field_id: layerField.id,
            name: rawOption.name,
            value: rawOption.value,
          }, { transaction });
        }));
      }));
      await transaction.commit();

      ctx.body = {
        payload: layer,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  };
}

function removeLayer(routeConfig={}) {
  const { sequelize } = routeConfig;

  const Layer = sequelize.model('layer');
  const OrganizationMember = sequelize.model('organization_member');


  return async function (ctx, layerId) {
    const layer = await Layer.find({
      where: {
        id: layerId,
      },
    });


    if (layer) {
      if (layer.is_created_by_system) {
        // 如果是系统图层，那么只有超级用户才可以修改
        ctx.assert(layer.is_created_by_system && ctx.state.user.role === 'immortal', 403);
      } else {
        // 或者用户是此图层所属组织的成员
        const layerOwnerMember = await OrganizationMember.findOne({
          organization_id: layer.owner_id,
          user_id: ctx.state.user.id,
        });
        ctx.assert(layerOwnerMember.role, 403);
      }

      // 伪删除，仅标记deleted_at属性
      await layer.destroy();
    }


    ctx.status = 204;
  };
}


function initGeometryStyle(geometryType) {
  const style = {};

  const fillDefaultStyle = {
    type: 'fill',
    enabled: true,
    color: tinycolor.random().toString(),
  };

  const strokeDefaultStyle = {
    type: 'stroke',
    enabled: true,
    width: 1,
    color: tinycolor.random().toString(),
  }

  if(geometryType === 'Point') {
    Object.assign(style, {
      type: 'point',
      enabled: true,
      graphic: {
        type: "graphic",
        value: {
          type: 'mark',
          enabled: true,
          shape: 'square',
          fill: fillDefaultStyle,
          stroke: strokeDefaultStyle,
        }
      },
      opacity: {
        type: 'opacity',
        enabled: true,
        value: 1,
      },
      size: {
        type: 'size',
        enabled: true,
        value: 6,
      },
      rotation: {
        type: 'rotation',
        enabled: true,
        value: 0
      },
      anchor_point: {
        type: 'anchor_point',
        enabled: true,
        x: 0.5,
        y: 0.5,
      },
      displacement: {
        type: 'displacement',
        enabled: true,
        x: 0,
        y: 0,
      },
    })
  } else if(geometryType === 'Curve') {
    Object.assign(style, {
      type: 'curve',
      enabled: true,
      stroke: strokeDefaultStyle,
    })

  } else if(geometryType === 'Surface') {
    Object.assign(style, {
      type: 'surface',
      enabled: true,
      fill: fillDefaultStyle,
      stroke: strokeDefaultStyle,
    })
  } else {
    throw new Error('invalid gemetry type');
  }
  return style;
}
