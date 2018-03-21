import L from 'leaflet';
import {
  convertStyle,
  coordsToLatLng,
  getPaneNameOfLayer,
} from '../utils';
import * as turf from '../tiny_turf';


export function removeFeatureElementWhenRemoveFeature(ctx) {
  return evt => {
    const { feature } = evt;
    const elem = ctx.elemStore.get(feature.uuid);
    if (elem) {
      elem.remove();
      ctx.elemStore.delete(feature.uuid);
    }
  };
}



export function renderFeatureElementWhenCreateFeature(ctx) {
  return evt => {
    const { feature } = evt;
    const { uuid, geometry_type, layer, geometry_style, geometry } = feature;
    const label = getFeatureLabel(feature);


    const paneName = getPaneNameOfLayer(layer);
    let elem;
    if (geometry_type === 'Point') {
      const [lng, lat] = geometry.coordinates;
      elem = L.custom.point([lat, lng], {
        label,
        feature,
        pane: paneName,
      });
    } else if (geometry_type === 'Curve') {
      if (geometry.type === 'LineString') {
        const latlngs = geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        elem = L.custom.curve(latlngs, {
          label,
          feature,
          pane: paneName,
          ...convertStyle(geometry_style),
        });
      }
    } else if (geometry_type === 'Surface') {
      if (geometry.type === 'Polygon') {
        elem = L.custom.surface(geometry.coordinates.map(ring => ring.slice(0, -1).map(([lng, lat]) => [lat, lng])), {
          label,
          feature,
          pane: paneName,
          ...convertStyle(geometry_style),
        });
      }
    }

    if (elem) {
      ctx.elemStore.set(uuid, elem);
      const layerGroup = ctx.layerGroupStore.get(paneName);
      elem.addTo(layerGroup);
    }
  };
}


export function updateFeatureElementWhenUpdateFeature(ctx) {
  return evt => {
    const { feature } = evt;
    const { geometry_type, geometry, geometry_style, displpay_way } = feature;
    const elem = ctx.elemStore.get(feature.uuid);

    elem.options.feature = feature;
    if (geometry_type === 'Point') {
      const [lng, lat] = geometry.coordinates;
      elem.setLatLng([lat, lng]);
    } else if (geometry_type === 'Curve') {
      const latlngs = displpay_way === 'curve'
        ? turf.bezierSpline(geometry).geometry.coordinates.map(coordsToLatLng)
        : geometry.coordinates.map(coordsToLatLng);
      elem.setLatLngs(latlngs);
      elem.setStyle(convertStyle(geometry_style));
    } else if (geometry_type === 'Surface') {
      const latlngs = displpay_way === 'curve'
        ? turf.bezierSpline(turf.polygonToLine(geometry)).geometry.coordinates.map(coordsToLatLng)
        : geometry.coordinates.map(ring => ring.slice(0, -1).map(coordsToLatLng));
      elem.setLatLngs(latlngs);
      elem.setStyle(convertStyle(geometry_style));
    }

    elem.setLabel(getFeatureLabel(feature));
  };
}


function getFeatureLabel(feature) {
  const titleProperty = feature.properties.find(property => property.name === 'title');
  const title = titleProperty ? titleProperty.value : '';
  return title;
};
