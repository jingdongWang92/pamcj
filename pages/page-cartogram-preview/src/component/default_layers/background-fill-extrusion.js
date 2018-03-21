export default {
  id: `background-fill-extrusion`,
  source: 'custom-data',
  filter: [
    'all',
    ['==', 'layer:code', 'background'],
  ],
  type: 'fill-extrusion',
  paint: {
    'fill-extrusion-color': {
      type: 'identity',
      property: 'style:fill:color',
    },
    'fill-extrusion-opacity': 1,
    'fill-extrusion-height': 0.1,
    'fill-extrusion-base': 0,
  },
};
