import { schema } from 'normalizr';


export const geometryStyle = new schema.Entity('geometryStyles', {
  idAttribute: 'id',
});
export const geometryStyles = [geometryStyle];
