export default {
  id: `beacon-circle`,
  source: 'custom-data',
  filter: [
    'all',
    ['==', 'layer:code', 'beacon'],
  ],
  type: 'circle',
  paint: {
    'circle-radius': 3,
    'circle-color': 'blue',
  },
};
