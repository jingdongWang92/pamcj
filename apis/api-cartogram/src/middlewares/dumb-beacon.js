'use strict';

const isFiniteNumber = require('lodash/fp/isFinite');
const uuid = require('uuid');
const identity = require('lodash/fp/identity');
const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);


const Cartogram = sequelize.model('cartogram');
const Vertex = sequelize.model('feature');
const Edge = sequelize.model('feature');
const Layer = sequelize.model('layer');
const DumbBeaconDevice = sequelize.model('dumb_beacon_device');


exports.batchCreateDumbBeacons = batchCreateDumbBeacons;
exports.batchRemoveDumbBeacons = batchRemoveDumbBeacons;


function batchCreateDumbBeacons() {
  const getBeaconLayer = (function () {
    let _beaconLayer;
    let _snField;

    return async () => {
      if (!_beaconLayer) {
        _beaconLayer = await Layer.findOne({ code: 'beacon' }).exec();
        _snField = _beaconLayer.fields.find(field => field.name === 'sn');
      }

      return [_beaconLayer, _snField];
    };
  }());


  return async function (ctx, cartogramId) {
    // 确认地图存在
    const condition = {
      _id: cartogramId,
    };
    const cartogram = await Cartogram.findOne(condition).exec();
    ctx.assert(cartogram, 400, '地图不存在');


    ctx.assert(Array.isArray(ctx.request.body), 400, '参数不是一个列表');


    const dumbBeaconInfoes = ctx.request.body;
    const dumbBeacons = await Promise.all(dumbBeaconInfoes.map(info => {
      const criteria = {
        owner: cartogram.owner,
        mote_eui: info.mote_eui,
      };
      return DumbBeaconDevice.findOne(criteria).exec();
    }));


    // 检查标签序列号是否有误
    const failedCheckingMoteEuies = dumbBeacons.reduce((accu, beacon, index) => {
      if (beacon) { return accu; }
      return [...accu, dumbBeaconInfoes[index].mote_eui];
    }, []);
    ctx.assert(failedCheckingMoteEuies.length === 0, 400, `以下共 ${failedCheckingMoteEuies.length} 个标签的序列号有误或不属于此地图的所有者，序列号：${failedCheckingMoteEuies.join(', ')}`);


    // 检查座标是否有误
    const failedCoordsCheckingMoteEuies = dumbBeaconInfoes.reduce((accu, info) => {
      if (isFiniteNumber(info.x) && isFiniteNumber(info.y)) { return accu; }

      return [...accu, info];
    }, []);
    ctx.assert(failedCoordsCheckingMoteEuies.length === 0, 400, `以下共 ${failedCoordsCheckingMoteEuies.length} 个标签的座标不是有效数字，序列号：${failedCoordsCheckingMoteEuies.map(info => info.mote_eui).join(', ')}`);


    const [layer, snField] = await getBeaconLayer();


    const existsDumbBeaconFeatures = await Promise.all(dumbBeacons.map(dumbBeacon => {
      return Edge.findOne({
        cartogram: cartogram.id,
        $or: [
          {
            'properties.sn': dumbBeacon.mote_eui,
          },
          {
            [`properties.${snField.id}`]: dumbBeacon.mote_eui,
          },
        ],
      }).exec();
    }));
    const unexistsDumbBeaconIndexes = dumbBeacons.reduce((accu, dumbBeacon, index) => {
      if (existsDumbBeaconFeatures[index]) { return accu; }
      return [...accu, index];
    }, []);
    const unexistsDumbBeaconInfoes = unexistsDumbBeaconIndexes.map(index => dumbBeaconInfoes[index]);


    const cartogramWidth = cartogram.width;
    await Promise.all(unexistsDumbBeaconInfoes.map(async info => {
      const vertex = new Vertex({
        owner: cartogram.owner,
        cartogram: cartogram.id,
        uuid: uuid(),
        lat: cartogramWidth - info.y, // 因为施工App绘制的座标系与leaflet绘制的座标系不同，所以要做一下projection
        lng: info.x,
        properties: {
          type: 'Vertex',
        },
      });
      await vertex.save();

      const edge = new Edge({
        owner: cartogram.owner,
        cartogram: cartogram.id,
        uuid: uuid(),
        layer: layer.id,
        geometry_style: layer.geometry_style,
        geometry_type: 'Point',
        vertexes: [vertex.uuid],
        properties: {
          sn: info.mote_eui,
          [snField.id]: info.mote_eui,
        },
      });
      await edge.save();
    }));
    ctx.status = 204;
  };
}


function batchRemoveDumbBeacons() {
  return async function (ctx, cartogramId) {
    // 确认地图存在
    const condition = {
      _id: cartogramId,
    };
    const cartogram = await Cartogram.findOne(condition).exec();
    ctx.assert(cartogram, 400, '地图不存在');


    ctx.assert(Array.isArray(ctx.request.body), 400, '参数不是一个列表');


    const dumbBeaconInfoes = ctx.request.body;
    const edges = await Promise.all(dumbBeaconInfoes.map(info => {
      const criteria = {
        owner: cartogram.owner,
        'properties.sn': info.mote_eui,
      };
      return Edge.findOne(criteria).exec();
    }));
    const validEdges = edges.filter(identity);
    const vertexUuids = validEdges.reduce((accu, edge) => [...accu, ...edge.vertexes], []);


    await Promise.all(validEdges.map(edge => edge.remove()));
    await Vertex.remove({ uuid: { $in: vertexUuids }});


    ctx.status = 204;
  };
}
