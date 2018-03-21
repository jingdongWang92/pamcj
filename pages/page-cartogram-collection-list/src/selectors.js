import { denormalize } from 'normalizr';
import { createStructuredSelector } from 'reselect';
import * as schemas from './schemas';


export const getAccessToken = state => state.accessToken;


export const getCartogramCollections = state => denormalize(state.cartogramCollections, schemas.cartogramCollections, state.entities);


export const getProps = createStructuredSelector({
  accessToken: getAccessToken,
  cartogramCollections: getCartogramCollections,
});
