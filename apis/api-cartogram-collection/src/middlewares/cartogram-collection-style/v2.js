const tinycolor = require('tinycolor2');
const turf = require('@turf/turf');
const curry = require('lodash/fp/curry');


module.exports = fetchCartogramCollectionGeoJSON;


function fetchCartogramCollectionGeoJSON(config) {
  return async function (ctx, cartogramCollectionId, next) {
    if (ctx.request.query.version !== 'v2') { return await next(); }


    const { cartogramCollection } = ctx.state;

    const geojson = cartogramCollectionToGeoJSON(cartogramCollection);
    ctx.body = JSON.stringify(geojson, null, 2);
    ctx.attachment(`${cartogramCollectionId}.json`);
  };
}


const cartogramCollectionToGeoJSON = curry((cartogramCollection) => {
  const cartogramCollectionData = {
    version: 'v2',
    id: cartogramCollection.id,
    type: 'Building',
    name: cartogramCollection.name,
    floors: cartogramCollection.cartograms.map(cartogramToGeoJSON(cartogramCollection)),
    conn: cartogramCollection.routes.map(cartogramRouteToJSON(cartogramCollection)),
  };
  cartogramCollectionData.last_modified = cartogramCollectionData.floors.length
    ? Math.max(...cartogramCollectionData.floors.map(floor => floor.last_modified))
    : Math.round(Date.now() / 1000);

  return cartogramCollectionData;
});



const cartogramToGeoJSON = curry((cartogramCollection, cartogram) => {
  const { features } = cartogram;
  const layerWithFeatures = features.reduce((accu, feature) => {
    const { layer } = feature;
    const layerId = layer.id;

    const item = accu[layerId] || {
      ...layer,
      features: [],
    };

    item.features.push(feature);
    accu[layerId] = item;

    return accu;
  }, {});
  const sortedGroupFeaturesByLayer = Object.values(layerWithFeatures).sort((a, b) => a.sequence - b.sequence);

  const cartogramData = {
    id: cartogram.id,
    type: 'Floor',
    name: cartogram.name,
    floor_label: cartogram.floor_label,
    floor_number: cartogram.floor_number,
    layers: sortedGroupFeaturesByLayer.map(layerToGeoJSON(cartogramCollection, cartogram)),
  };

  // 计算bbox和三维
  cartogramData.bbox = cartogramData.layers.length
    ? turf.bbox(turf.featureCollection(cartogramData.layers.map(layer => turf.bboxPolygon(layer.bbox))))
    : [0, 0, 0, 0];

  cartogramData.length = cartogramData.bbox[2] - cartogramData.bbox[0];
  cartogramData.width = cartogramData.bbox[3] - cartogramData.bbox[1];
  cartogramData.height = 0;

  // 计算最后更新日期
  cartogramData.last_modified = cartogramData.layers.length
    ? Math.max(...cartogramData.layers.map(layer => layer.last_modified))
    : Math.round(Date.now() / 1000);

  return cartogramData;
});


const layerToGeoJSON = curry((cartogramCollection, cartogram, layer) => {
  const { features, code } = layer;


  if (code === 'road') {
    return roadLayerToGeoJSON(cartogramCollection, cartogram, layer);
  }


  const sortedFeatures = features.sort((a, b) => {
    const aSeq = Number.parseInt(a.properties.sequence, 10) || 0;
    const bSeq = Number.parseInt(b.properties.sequence, 10) || 0;


    return aSeq - bSeq;
  });


  const layerData = {
    id: layer.id,
    type: 'Layer',
    name: layer.name,
    alias: layer.code,
    sequence: layer.sequence,
    features: sortedFeatures.map(featureToGeoJSON(cartogramCollection, cartogram, layer)),
    last_modified: Math.max(...sortedFeatures.map(feature => feature.updated_at)) / 1000,
  };


  layerData.bbox = sortedFeatures.length
    ? turf.bbox(turf.geometryCollection(sortedFeatures.map(feature => feature.geometry)))
    : [0, 0, 0, 0];


  return layerData;
});


const roadLayerToGeoJSON = curry((cartogramCollection, cartogram, layer) => {
  const features = layer.features.reduce((accu, feature) => {
    const geometry = turf.cleanCoords(feature.geometry);
    const segments = turf.lineSegment(geometry);
    return [...accu, ...segments];
  }, []);


  const layerData = {
    id: layer.id,
    type: 'Layer',
    name: layer.name,
    alias: layer.code,
    sequence: layer.sequence,
    features: features.map(featureToGeoJSON(cartogramCollection, cartogram, layer)),
  };


  return layerData;
});


const featureToGeoJSON = curry((cartogramCollection, cartogram, layer, feature) => {
  const { geometry, properties } = feature;


  const _f = {
    id: feature._alt_id || feature.id,
    type: 'Feature',
    name: properties.title || '',
    geoType: feature.geometry_type,
    coords: geometry.coordinates,
    properties: properties.reduce((accu, property) => {
      return {
        ...accu,
        [property.name]: property.value,
      };
    }, {}),
  };

  if (geometry.type !== 'Point') {
    _f.style = getStyleOfFeature(feature);
  }


  const center = turf.center(turf.feature(geometry)).geometry.coordinates;
  _f.x = center[0];
  _f.y = center[1];



  if (layer.code === 'road') {
    if (!properties.highway || properties.highway === 'false') {
      properties.highway = 'both';
    }


    if (!properties.oneway || properties.oneway === 'false') {
      properties.oneway = 'no';
    }
  }


  return _f;
});


function getStyleOfFeature(feature) {
  const _style = feature.geometry_style;


  const strokeColor = tinycolor(_style.stroke_color).toRgb();
  const fillColor = tinycolor(_style.fill_color).toRgb();


  const style = {
    fill: {
      color: {
        r: fillColor.r,
        g: fillColor.g,
        b: fillColor.b,
        a: Number.parseInt(fillColor.a * 255, 10),
      },
    },
    stroke: {
      color: {
        r: strokeColor.r,
        g: strokeColor.g,
        b: strokeColor.b,
        a: Number.parseInt(strokeColor.a * 255, 10),
      },
      width: _style.stroke_width,
    },
  };
  return style;
}


const cartogramRouteToJSON = curry((cartogramCollection, cartogramRoute) => {
  return {
    coords : [
      getPosition(cartogramRoute.from_feature),
      getPosition(cartogramRoute.to_feature),
    ],
    properties : {
      highway : cartogramRoute.highway,
      oneway : cartogramRoute.oneway,
    }
  };
});


async function getPosition(feature) {
  const geometry = feature.geometry;
  const center = turf.center(turf.feature(geometry)).geometry.coordinates;

  return [feature.cartogram.floor_number, ...center.map(preciseTo(3))];
}


function preciseTo(len) {
  return num => Number(num.toFixed(len));
}
