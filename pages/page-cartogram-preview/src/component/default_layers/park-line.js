export default {
  id: `park-line`,
  source: 'custom-data',
  filter: [
    'all',
    ['==', 'layer:code', 'park'],
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
