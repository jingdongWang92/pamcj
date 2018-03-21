import { schema } from 'normalizr';


export const cartogram = new schema.Entity('cartograms');
export const cartograms = [cartogram];


export const cartogramCollection = new schema.Entity('cartogramCollections', {
  cartograms,
});
export const cartogramCollections = [cartogramCollection];


export const layer = new schema.Entity('layers');
export const layers = [layer];


export const feature = new schema.Entity('features', {
  cartogram,
  layer,
}, {
  processStrategy: (featureValue) => {
    return {
      ...featureValue,
      formattedProperties: featureValue.properties.reduce((accu, property) => ({
        ...accu,
        [property.name]: property.value,
      }), {}),
    };
  },
});
export const features = [feature];


export const cartogramRoute = new schema.Entity('cartogramRoutes', {
  cartogram_collection: cartogramCollection,
  from_feature: feature,
  to_feature: feature,
});
export const cartogramRoutes = [cartogramRoute];
