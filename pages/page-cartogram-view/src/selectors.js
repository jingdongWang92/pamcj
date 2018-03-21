import { denormalize } from 'normalizr';
import * as schemas from './schemas';
import { createStructuredSelector } from 'reselect';

export const getCartogram = state => denormalize(state.cartogram, schemas.cartogram, state.entities);

export const getOrganizations = state => denormalize(state.organizations, schemas.organizations, state.entities);

export const getAccessToken = state => state.accessToken;

export const getInputTips = state => state.inputTips;

export const getSubmitting = state => state.submitting;

export const getProps = createStructuredSelector({
  initialValues: getCartogram,
  organizations: getOrganizations,
  accessToken: getAccessToken,
  inputTips: getInputTips,
  isSubmitting: getSubmitting,
});
