'use strict';

const uuid = require('uuid');
const omit = require('lodash/fp/omit');
const groupBy = require('lodash/groupBy');
const identity = require('lodash/identity');
const moment = require('moment');


exports.authCreateCartogram = authCreateCartogram;
exports.createCartogram = createCartogram;
exports.searchCartograms = searchCartograms;
exports.fetchCartogram = fetchCartogram;
exports.fetchCartogramGeoJSON = fetchCartogramGeoJSON;
exports.updateCartogram = updateCartogram;
exports.removeCartogram = removeCartogram;
exports.duplicateCartogram = duplicateCartogram;


function authCreateCartogram({ sequelize }) {
  const Cartogram = sequelize.model('cartogram');
  const User = sequelize.model('user');
  const Plan = sequelize.model('plan');
  const Organization = sequelize.model('organization');

  return async function authCreateCartogram(ctx, next) {
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

    const total = await Cartogram.count({
      where: {
        owner_id: organization.id,
      },
    });
    const limit = organization.plan == null ? 3 : organization.plan.map_count;

    ctx.assert(total < limit, 400, `该账号当前最多只能创建${limit}张地图`);

    ctx.state.organization = organization;

    return next();
  };
}

function createCartogram({ sequelize }) {
  const Cartogram = sequelize.model('cartogram');
  const Organization = sequelize.model('organization');
  const User = sequelize.model('user');


  return async function createCartogram(ctx) {
    ctx.assert(ctx.request.body.name, 400, 'name未填写');
    ctx.assert(ctx.request.body.address, 400, '地图地址未填写');
    ctx.assert(ctx.request.body.floor_label, 400, '无效楼层label');

    const floorIndex = Number.parseInt(ctx.request.body.floor_index, 10);
    ctx.assert(!Number.isNaN(floorIndex), 400, '无效楼层序号');


    const floorNumber = Number.parseInt(ctx.request.body.floor_number, 10);
    ctx.assert(!Number.isNaN(floorNumber), 400, '无效楼层');


    const cartogram = await Cartogram.create(Object.assign({}, ctx.request.body, {
      owner_id: ctx.state.organization.id,
      floor_index: floorIndex,
      floor_number: floorNumber,
    }));


    ctx.body = {
      payload: cartogram,
    };
  };
}


function searchCartograms({ sequelize }) {
  const Cartogram = sequelize.model('cartogram');
  const Organization = sequelize.model('organization');
  // const User = sequelize.model('user');
  // const OrganizationMember = sequelize.model('organization_member');
  const Op = sequelize.Op;


  return async function (ctx) {

    const sortCondition = [];

    if (ctx.request.query.sort_by) {
      const sort = ['asc', 'desc'].includes(ctx.request.query.sort) ? ctx.request.query.sort : 'asc';
      sortCondition.push([ctx.request.query.sort_by, sort.toUpperCase()]);
    }


    const myOrganizationIds = sequelize.dialect.QueryGenerator.selectQuery('organization_member', {
      attributes: ['organization_id'],
      where: {
        user_id: ctx.state.user.id,
      },
    }).slice(0, -1);


    const { rows: cartograms, count: total } = await Cartogram.findAndCountAll({
      where: {
        owner_id: {
          [Op.in]: sequelize.literal(`(${myOrganizationIds})`),
        },
      },
      limit: ctx.request.query.limit,
      offset: ctx.request.query.skip,
      include: [
        {
          model: Organization,
          as: 'owner',
        },
      ],
      order: sortCondition,
    });


    ctx.body = {
      payload: cartograms,
      meta: { total },
    };
  };
}


function fetchCartogram({ sequelize, fusionClient }) {
  const Cartogram = sequelize.model('cartogram');
  const Organization = sequelize.model('organization');


  return async function (ctx, cartogramId) {
    const cartogram = await Cartogram.find({
      where: {
        id: cartogramId,
      },
      include: [
        {
          model: Organization,
          as: 'owner',
        },
      ],
    });
    ctx.assert(cartogram, 404, 'no cartogram found');


    const cartogramJson = cartogram.toJSON();

    ctx.body = {
      payload: cartogramJson,
    };
  };
}


function fetchCartogramGeoJSON({ sequelize }) {
  const Cartogram = sequelize.model('cartogram');
  const Edge = sequelize.model('feature');
  const Vertex = sequelize.model('feature');

  return async function (ctx, cartogramId) {
    const condition = {
      deleted_at: null,
      _id: cartogramId,
      $or: [
        { owner: ctx.state.user.id },
        { public: true },
      ],
    };
    const cartogram = await Cartogram
        .findOne(condition)
        .populate('owner')
        .exec();
    ctx.assert(cartogram, 404, 'no cartogram found');


    ctx.body = {
      payload: await cartogramToGeoJSON({ Edge, Vertex }, cartogram),
    };
  };
}


async function cartogramToGeoJSON({ Edge, Vertex }, cartogram) {
  let features = await Edge
      .find({ cartogram: cartogram.id })
      .populate('layer')
      .populate('layer')
      .populate('geometry_style')
      .exec();


  const groupedFeatures = groupBy(features.filter(feature => feature.layer), feature => feature.layer.code);


  let json = cartogram.toJSON();
  json = Object.assign({}, omit(['owner'], json), {
    type: 'Cartogram',
    layers: await Promise.all(Object.values(groupedFeatures)
        .map(async _features => {
          const layer = await _features[0].layer.populate('geometry_style').execPopulate();
          const layerJSON = layer.toJSON();


          const layerOmitProps = [
            'fields',
            'created_at',
            'updated_at',
            'geometry_style',
            'owner',
            'owner_id',
            'geometry_style_id',
          ];
          return Object.assign({}, omit(layerOmitProps, layerJSON), {
            type: 'Layer',
            features: await Promise.all(_features.map(async feature => {
              const featureJSON = feature.toJSON();


              const featureOmitProps = [
                'fields',
                'vertexes',
                'owner',
                'owner_id',
                'geometry_style_id',
                'layer',
                'layer_id',
                'cartogram',
                'cartogram_id',
                'created_at',
                'updated_at',
                'geometry_type',
              ];
              return Object.assign({}, omit(featureOmitProps, featureJSON), {
                geometry: {
                  type: feature.geometry_type,
                  coordinates: (await Promise.all(feature.vertexes.map(async vertexUUID => {
                    const vertex = await Vertex.findOne({ uuid: vertexUUID }).exec();
                    if (!vertex) { return null; }
                    return [vertex.lng.toFixed(2), vertex.lat.toFixed(2)];
                  }))).filter(identity),
                },
                properties: [...layer.fields, ...feature.fields].reduce((accu, field) => {
                  const _accu = Object.assign({}, accu, {
                    [field.name]: accu[field.id],
                  });
                  delete _accu[field.id];
                  return _accu;
                }, feature.properties)
              });
            })),
          });
        })),
  });

  return json;
}


function updateCartogram({ sequelize }) {
  const Cartogram = sequelize.model('cartogram');

  return async function (ctx, cartogramId) {
    const cartogram = await Cartogram.findById(cartogramId);
    ctx.assert(cartogram, 400, 'no cartogram found');


    ctx.assert(ctx.request.body.name, 400, 'name未填写');
    ctx.assert(ctx.request.body.address, 400, '地图地址未填写');


    if (ctx.request.body.floor_index && ctx.request.body.floor_index !== 0) {
      ctx.assert(!Number.isNaN(Number.parseInt(ctx.request.body.floor_index, 10)), 400, '无效楼层序号');
    }

    if (ctx.request.body.floor_number && ctx.request.body.floor_number !== 0) {
      ctx.assert(!Number.isNaN(Number.parseInt(ctx.request.body.floor_number, 10)), 400, '无效楼层');
    }


    await cartogram.update(Object.assign({}, cartogram, omit(['id', 'owner',], ctx.request.body), {
      floor_index: Number.parseInt(ctx.request.body.floor_index, 10),
      floor_number: Number.parseInt(ctx.request.body.floor_number, 10),
    }));

    await cartogram.update(Object.assign({}, cartogram));

    ctx.body = {
      payload: cartogram,
    };
  };
}


function removeCartogram({ sequelize }) {
  const Cartogram = sequelize.model('cartogram');
  return async function (ctx, cartogramId) {
    const cartogram = await Cartogram.findById(cartogramId);
    ctx.assert(cartogram, 400, 'cartogram not found');
    await cartogram.destroy();
    ctx.status = 204;
  };
}


function duplicateCartogram({ sequelize }) {
  const Cartogram = sequelize.model('cartogram');
  const Edge = sequelize.model('feature');
  const Vertex = sequelize.model('feature');

  return async function (ctx, cartogramId) {
    const condition = {
      deleted_at: null,
      owner: ctx.state.user.id,
      _id: cartogramId,
    };


    const cartogram = await Cartogram.findOne(condition).exec();
    ctx.assert(cartogram, 400, '地图不存在或已删除');


    const originCartogramData = omit(['id', '_id', 'created_at', 'updated_at'], cartogram.toJSON());
    const newCartogram = new Cartogram(Object.assign({}, originCartogramData, {
      name: `${cartogram.name} (副本)`,
    }));
    await newCartogram.save();

    const vertexes = await Vertex.find({
      cartogram: cartogram.id,
    }).exec();
    const newVertexes = vertexes.map(vertex => new Vertex(Object.assign({}, omit(['id', '_id'], vertex.toJSON()), {
      uuid: uuid(),
      cartogram: newCartogram.id,
    })));
    await Promise.all(newVertexes.map(vertex => vertex.save()));


    const edges = await Edge.find({
      cartogram: cartogram.id,
    }).exec();
    const newEdges = edges.map(edge => new Edge(Object.assign({}, omit(['id', '_id'], edge.toJSON()), {
      uuid: uuid(),
      cartogram: newCartogram.id,
      vertexes: edge.vertexes
          .map(vertexUuid => {
            const vertexIndex = vertexes.findIndex(_vertex => _vertex.uuid === vertexUuid);
            return newVertexes[vertexIndex];
          })
          .map(newVertex => newVertex.uuid),
    })));
    await Promise.all(newEdges.map(edge => edge.save()));


    await newCartogram
        .populate('owner')
        .execPopulate();


    ctx.body = {
      payload: newCartogram,
    };
  };
}
