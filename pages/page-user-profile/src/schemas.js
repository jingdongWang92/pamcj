import { schema } from 'normalizr';


export const user = new schema.Entity('users');
export const users = [user];

export const order = new schema.Entity('orders');
export const orders = [order];

export const invoice = new schema.Entity('invoices');
export const invoices = [invoice];
