import { schema } from 'normalizr';


export const organization = new schema.Entity('organizations');
export const organizations = [organization];


export const geometryStyle = new schema.Entity('geometryStyles');
export const geometryStyles = [geometryStyle];


export const layer = new schema.Entity('layers', {
  owner: organization,
  geometryStyle,
});
export const layers = [layer];
