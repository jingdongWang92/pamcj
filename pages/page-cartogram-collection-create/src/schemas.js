import { schema } from 'normalizr';


export const cartogramCollection = new schema.Entity('cartogramCollections', {
  idAttribute: 'id',
});
export const cartogramCollections = [cartogramCollection];

export const cartogram = new schema.Entity('cartograms', {
  idAttribute: 'id',
});
export const cartograms = [cartogram];

export const organization = new schema.Entity('organizations', {
  idAttribute: 'id',
});
export const organizations = [organization];
