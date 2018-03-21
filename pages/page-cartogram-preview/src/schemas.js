import { schema } from 'normalizr';


export const cartogram = new schema.Entity('cartograms');
export const cartograms = [cartogram];

export const cartogramGeojson = new schema.Entity('cartogramGeojsons');
export const cartogramGeojsons = [cartogramGeojson];
