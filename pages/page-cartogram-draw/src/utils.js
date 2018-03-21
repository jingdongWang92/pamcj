import tinycolor from 'tinycolor2';
import uuid from 'uuid';
import flow from 'lodash/fp/flow';
import camelCase from 'lodash/fp/camelCase';
import upperFirst from 'lodash/fp/upperFirst';
import curry from 'lodash/fp/curry';
import identity from 'lodash/fp/identity';
import isFunction from 'lodash/fp/isFunction';
import isArray from 'lodash/fp/isArray';
import L from 'leaflet';


export function positionEqual(p1, p2) {
  return p1 && p2 && p1[0] === p2[0] && p1[1] === p2[1];
}


export function removeProtocolOfHref(href) {
  if (href.startsWith('https:')) { return href.slice('https:'.length); }
  if (href.startsWith('http:')) { return href.slice('http:'.length); }
}


export function convertPointStyle(geometry_style) {
  return null;
}


export function convertCurveStyle(geometry_style) {
  const { stroke } = geometry_style.style;

  const strokeColor = tinycolor(stroke.color);

  const _style = {
    stroke: stroke.enabled,
    weight: stroke.width,
    color: strokeColor.toString(),
    opacity: strokeColor.getAlpha(),
  };
  return _style;
}


export function convertSurfaceStyle(geometry_style) {
  const { fill, stroke } = geometry_style.style;

  const fillColor = tinycolor(fill.color);
  const strokeColor = tinycolor(stroke.color);

  const _style = {
    fill: fill.enabled,
    fillColor: fillColor.toString(),
    fillOpacity: fillColor.getAlpha(),
    stroke: stroke.enabled,
    weight: stroke.width,
    color: strokeColor.toString(),
    opacity: strokeColor.getAlpha(),
  };
  return _style;
}


export function convertStyle(geometry_style) {
  if (!geometry_style) { return; }

  const { geometry_type } = geometry_style;
  if (geometry_type === 'Point') {
    return convertPointStyle(geometry_style);
  } else if (geometry_type === 'Curve') {
    return convertCurveStyle(geometry_style);
  } else if (geometry_type === 'Surface') {
    return convertSurfaceStyle(geometry_style);
  }
}


export function genFeature(cartogram, selectedLayer, geometry) {
  return {
    uuid: uuid(),
    geometry_type: selectedLayer.geometry_type,
    cartogram_id: cartogram.id,
    cartogram: cartogram,
    layer_id: selectedLayer.id,
    layer: selectedLayer,
    geometry_style_id: selectedLayer.geometry_style.id,
    geometry_style: selectedLayer.geometry_style,
    fields: [],
    properties: [],
    geometry,
  };
}


export const pascalCase = flow([camelCase, upperFirst]);


export const minValueAndIndexBy = curry((iteratee = identity, array) => {
  if (!isFunction(iteratee)) { throw new Error('the first argument should be a function'); }
  if (!isArray(array)) { throw new Error('the second argument should be an array'); }

  let minIndex = 0;
  let minValue = iteratee(array[minIndex]);

  for (let i = minIndex + 1, len = array.length; i < len; i++) {
    const value = iteratee(array[i]);

    if (value < minValue) {
      minValue = value;
      minIndex = i;
    }
  }

  return [array[minIndex], minIndex];
});


export const coordsToLatLng = L.GeoJSON.coordsToLatLng;
export const latLngToCoords = L.GeoJSON.latLngToCoords;


export const getPaneNameOfLayer = layer => `${layer.code}-${layer.id}`;

export function getFeatureLabel(feature) {
  const titleProperty = feature.properties.find(property => property.name === 'title');
  const title = titleProperty ? titleProperty.value : '';
  return title;
}
