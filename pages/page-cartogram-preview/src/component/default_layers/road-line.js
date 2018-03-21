export default {
  id: `road-line`,
  source: 'custom-data',
  filter: [
    'all',
    ['==', 'layer:code', 'road'],
  ],
  type: 'line',
  paint: {
    'line-color': {
      type: 'identity',
      property: 'style:stroke:color',
    },
    'line-width': {
      type: 'identity',
      property: 'style:stroke:width',
    },
  },
};
