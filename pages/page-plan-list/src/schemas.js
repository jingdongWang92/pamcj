import { schema } from 'normalizr';


export const plan = new schema.Entity('plans', {
  idAttribute: 'id',
});
export const plans = [plan];
