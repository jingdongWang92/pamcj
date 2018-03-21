import * as constants from './constants';
import get from 'lodash/get';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';
import { createStructuredSelector } from 'reselect';


export const getInitialValues = state => ({
  cartogram_ids: [],
});


export const getCartograms = state => denormalize(state.cartograms, schemas.cartograms, state.entities);


export const getCartogramSelectStatus = state => {
  const selectedCartogramIds = get(state.form[constants.MODULE_NAME], 'values.cartogram_ids', []);
  const status = selectedCartogramIds.reduce((accu, cartogramId) => ({
    ...accu,
    [cartogramId]: true,
  }), {});
  return status;
};


export const getOrganizations = state => denormalize(state.organizations, schemas.organizations, state.entities);

export const getSubmitting = state => state.submitting;

export const getProps = createStructuredSelector({
  initialValues: getInitialValues,
  cartograms: getCartograms,
  organizations: getOrganizations,
  cartogramSelectStatus: getCartogramSelectStatus,
  isSubmitting: getSubmitting,
});
