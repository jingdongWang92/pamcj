const turf = require('@turf/turf');
const raw = require('./59eb35a39f0b42000166f66e.json');

function formatCartogramCollection(cartogramCollection) {
  let json = {
    ...cartogramCollection,
    floors: cartogramCollection.floors.map(formatCartogram),
  };

  json = {
    ...json,
    floors: json.floors.map(fc => {
      return turf.toWgs84(fc, {
        mutate: true,
      });
    }),
  }

  return json;
}

function formatCartogram(cartogram) {

  const {
    id,
    name,
    length,
    width,
    height,
    floor_label,
    floor_index,
    floor_number,
    layers,
    bbox,
  } = cartogram;

  return {
    id,
    type: 'FeatureCollection',
    features: layers.reduce((accu, layer) => {
      const {
        name: layerName,
        alias: layerCode,
        sequence: layerSequence,
        features,
      } = layer;

      return [
        ...accu,
        ...features.map(feature => {
          const {
            id,
            name,
            geoType,
            coords,
            style,
            properties: {
              sequence,
            },
          } = feature;

          let geometry;
          if (geoType === 'Point') {
            geometry = {
              type: 'Point',
              coordinates: coords,
            };
          } else if (geoType === 'LineString') {
            geometry = {
              type: 'LineString',
              coordinates: coords,
            };
          } else if (geoType === 'Polygon') {
            geometry = {
              type: 'Polygon',
              coordinates: [coords],
            };
          }

          return {
            id,
            type: 'Feature',
            geometry,
            properties: {
              name,
              layerName,
              layerCode,
              sequence: layerSequence + sequence,
              fill_color: style && `rgba(${style.fill.color.r}, ${style.fill.color.g}, ${style.fill.color.b}, ${style.fill.color.a / 255})`,
              stroke_width: style && style.stroke.width,
              stroke_color: style && `rgba(${style.stroke.color.r}, ${style.stroke.color.g}, ${style.stroke.color.b}, ${style.stroke.color.a / 255})`,
              shadow_blur: style && style.shadow.blur,
              shadow_offset: style && style.shadow.offset,
              shadow_color: style && `rgba(${style.shadow.color.r}, ${style.shadow.color.g}, ${style.shadow.color.b}, ${style.shadow.color.a / 255})`,
            },
          };
        }),
      ];
    }, []),
    properties: {
      name,
      length,
      width,
      height,
      floor_label,
      floor_index,
      floor_number,
    },
    bbox,
  };
}

console.log(JSON.stringify(formatCartogramCollection(raw), null, 2));
