export default {
  id: `park-fill-extrusion`,
  source: 'custom-data',
  filter: [
    'all',
    ['==', 'layer:code', 'park'],
  ],
  type: 'fill-extrusion',
  paint: {
    'fill-extrusion-color': {
      type: 'identity',
      property: 'style:fill:color',
    },
    'fill-extrusion-height': 0.3,
    'fill-extrusion-base': 0.1,
  },
};
