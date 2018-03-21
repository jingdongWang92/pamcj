import { Schema } from 'normalizr';


export const user = new Schema('users', {
  idAttribute: 'id',
});

export const fetchUser = user;
