const tinycolor = require('tinycolor2');
const turf = require('@turf/turf');
const curry = require('lodash/fp/curry');


module.exports = fetchCartogramCollectionGeoJSON;


function fetchCartogramCollectionGeoJSON(config) {
  return async function (ctx, cartogramCollectionId, next) {
    if (ctx.request.query.version !== 'v3') { return await next(); }


    const { cartogramCollection } = ctx.state;

    const geojson = cartogramCollectionToGeoJSON(cartogramCollection);
    ctx.body = JSON.stringify(geojson, null, 2);
    ctx.attachment(`${cartogramCollectionId}.json`);
  };
}


const cartogramCollectionToGeoJSON = curry((cartogramCollection) => {
  const cartogramCollectionData = {
    version: '2.0.0',
    id: cartogramCollection.id,
    type: 'Building',
    name: cartogramCollection.name,
    floors: cartogramCollection.cartograms.map(cartogramToGeoJSON(cartogramCollection)),
    conn: cartogramCollection.routes.map(cartogramRouteToJSON(cartogramCollection)),
    properties: {
      name: cartogramCollection.name,
    }
  };
  cartogramCollectionData.properties.last_modified = cartogramCollectionData.floors.length
    ? Math.max(...cartogramCollectionData.floors.map(floor => floor.properties.last_modified))
    : Math.round(Date.now() / 1000);

  return cartogramCollectionData;
});



const cartogramToGeoJSON = curry((cartogramCollection, cartogram) => {
  const { features } = cartogram;

  const featureJSON = features.map(featureToGeoJSON(cartogramCollection, cartogram));
  const cartogramData = {
    id: cartogram.id,
    type: 'FeatureCollection',
    features: featureJSON,
    bbox: features.length
      ? turf.bbox(turf.featureCollection(featureJSON.map(feature => turf.bboxPolygon(feature.bbox))))
      : [0, 0, 0, 0],
    properties: {
      name: cartogram.name,
      floor_label: cartogram.floor_label,
      floor_number: cartogram.floor_number,
      last_modified: features.length
        ? Math.max(...featureJSON.map(feature => feature.properties.last_modified))
        : Math.round(Date.now() / 1000),
    },
  };

  return cartogramData;
});


const featureToGeoJSON = curry((cartogramCollection, cartogram, feature) => {
  const { geometry, properties } = feature;


  const _f = {
    id: feature._alt_id || feature.id,
    type: 'Feature',
    geometry,
    properties: properties.reduce((accu, property) => {
      return {
        ...accu,
        [property.name]: property.value,
      };
    }, {
      last_modified: feature.updated_at.valueOf(),
    }),
    bbox: turf.bbox(geometry),
  };

  if (!_f.properties.name) {
    _f.properties.name = _f.properties.title;
  }

  _f.properties['layer:code'] = feature.layer.code;

  if (geometry.type !== 'Point') {
    const style = getStyleOfFeature(feature);
    _f.properties = {
      ..._f.properties,
      ...style,
    };
  }

  return _f;
});


function getStyleOfFeature(feature) {
  const _style = feature.geometry_style.style;

  const style = {};

  if (_style.stroke) {
    const strokeColor = tinycolor(_style.stroke.color);
    style['style:stroke:color'] = strokeColor.toRgbString();
    style['style:stroke:opacity'] = strokeColor.getAlpha();
    style['style:stroke:width'] = _style.stroke.width;
  }

  if (_style.fill) {
    const fillColor = tinycolor(_style.fill.color);
    style['style:fill:color'] = fillColor.toRgbString();
    style['style:fill:opacity'] = fillColor.getAlpha();
  }

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
