export default {
  id: `room-fill-extrusion`,
  source: 'custom-data',
  filter: [
    'all',
    ['==', 'layer:code', 'room'],
  ],
  type: 'fill-extrusion',
  paint: {
    'fill-extrusion-color': {
      type: 'identity',
      property: 'style:fill:color',
    },
    'fill-extrusion-opacity': 0.6,
    'fill-extrusion-height': 3,
    'fill-extrusion-base': 0.1,
  },
};
