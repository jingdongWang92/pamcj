import { denormalize } from 'normalizr';
import * as schemas from './schemas';
import { createStructuredSelector } from 'reselect';


export const getCartograms = state => denormalize(state.cartograms, schemas.cartograms, state.entities);

export const getCartogramGeojson = cartogramId => state => denormalize(cartogramId, schemas.cartogramGeojson, state.entities);

export const getRenderingCartogramGeojson = state => denormalize(state.renderingCartogram, schemas.cartogramGeojson, state.entities);

export const isCartogramLoading = state => state.isCartogramLoading;

export const getProps = createStructuredSelector({
  cartograms: getCartograms,
  cartogramGeojson: getRenderingCartogramGeojson,
  isCartogramLoading,
});
