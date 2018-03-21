import { createStructuredSelector, createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';


export const getCartogramGeoreference = state => denormalize(state.cartogramGeoreference, schemas.cartogramGeoreference, state.entities);


export const getCartogram = createSelector(
  getCartogramGeoreference,
  cartogramGeoreference => cartogramGeoreference && cartogramGeoreference.cartogram,
);

export const getSubmitting = state => state.submitting;


export const mapStateToProps = createStructuredSelector({
  cartogramGeoreference: getCartogramGeoreference,
  cartogram: getCartogram,
  isSubmitting: getSubmitting,
});
