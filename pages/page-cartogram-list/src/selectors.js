import { denormalize } from 'normalizr';
import * as schemas from './schemas';
import { createStructuredSelector } from 'reselect';


export const getCartograms = state => denormalize(state.cartograms, schemas.cartograms, state.entities);

export const getQueryConditions = state => state.queryConditions;

export const getLoading = state => state.loading;

export const getProps = createStructuredSelector({
  cartograms: getCartograms,
  queryConditions: getQueryConditions,
  loading: getLoading,
});
