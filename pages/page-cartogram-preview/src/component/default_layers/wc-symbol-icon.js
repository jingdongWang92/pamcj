export default {
  id: `wc-symbol`,
  source: 'custom-data',
  filter: [
    'all',
    ['==', 'layer:code', 'wc'],
  ],
  type: 'symbol',
  layout: {
    'icon-image': 'toilet-15',
    'icon-size': 2,
  },
};
