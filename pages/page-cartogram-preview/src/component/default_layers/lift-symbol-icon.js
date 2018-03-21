export default {
  id: `lift-symbol`,
  source: 'custom-data',
  filter: [
    'all',
    ['==', 'layer:code', 'lift'],
  ],
  type: 'symbol',
  layout: {
    'icon-image': 'entrance-15',
    'icon-size': 2,
  },
};
