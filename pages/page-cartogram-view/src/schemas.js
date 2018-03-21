import { schema } from 'normalizr';


export const organization = new schema.Entity('organizations');
export const organizations = [organization];


export const cartogram = new schema.Entity('cartograms', {
  owner: organization,
}, {
  processStrategy: cartogram => {
    cartogram.owner_id = cartogram.owner_id.toString();
    return cartogram;
  },
});
export const cartograms = [cartogram];
