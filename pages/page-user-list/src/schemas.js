import { schema } from 'normalizr';


export const plan = new schema.Entity('plans');
export const plans = [plan];


export const user = new schema.Entity('users', {
  plan,
});
export const users = [user];
