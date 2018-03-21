import { schema } from 'normalizr';

export const cartogram = new schema.Entity('cartograms', {
  idAttribute: 'id',
});
export const cartograms = [cartogram];

export const location = new schema.Entity('location', {
  idAttribute: 'id',
});

export const organization = new schema.Entity('organizations', {
  idAttribute: 'id',
});
export const organizations = [organization];
