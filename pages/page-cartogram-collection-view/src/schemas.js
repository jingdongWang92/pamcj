import { schema } from 'normalizr';


export const cartogram = new schema.Entity('cartograms');
export const cartograms = [cartogram];


export const cartogramCollection = new schema.Entity('cartogramCollections', {
  cartograms,
}, {
  processStrategy: (value) => {
    const cartogramIds = value.cartograms.map(cartogram => cartogram.id)
    return Object.assign(value, {
      cartogram_ids: cartogramIds,
    });
  },
});
export const cartogramCollections = [cartogramCollection];
