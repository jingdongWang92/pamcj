import { schema } from 'normalizr';


export const user = new schema.Entity('users');
export const users = [user];


export const plan = new schema.Entity('plans');
export const plans = [plan];


export const organization = new schema.Entity('organizations', {
  owner: user,
  members: users,
  plan,
});
export const organizations = [organization];


export const order = new schema.Entity('orders', {
  user,
  organization,
  plan,
});
export const orders = [order];
