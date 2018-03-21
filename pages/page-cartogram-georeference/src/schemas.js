import { schema } from 'normalizr';


export const cartogram = new schema.Entity('cartograms');
export const cartograms = [cartogram];


export const cartogramGeoreference = new schema.Entity('cartogramGeoreferences', {
  cartogram,
});
export const cartogramGeoreferences = [cartogramGeoreference];
