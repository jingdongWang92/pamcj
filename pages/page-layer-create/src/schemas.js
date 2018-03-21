import { schema } from 'normalizr';


export const user = new schema.Entity('users');
export const users = [user];


export const layer = new schema.Entity('layers');
export const layers = [layer];


export const organization = new schema.Entity('organizations');
export const organizations = [organization];
