import { schema } from 'normalizr';


export const plan = new schema.Entity('plans');
export const plans = [plan];


export const user = new schema.Entity('users', {
  plan,
});
export const users = [user];


export const organization = new schema.Entity('organizations', {
  owner: user,
  plan,
});
export const organizations = [organization];


export const organizationMember = new schema.Entity('organizationMembers', {
  organization,
  user,
});
export const organizationMembers = [organizationMember];


export const organizationInvitation = new schema.Entity('organizationInvitations', {
  organization,
});
export const organizationInvitations = [organizationInvitation];
