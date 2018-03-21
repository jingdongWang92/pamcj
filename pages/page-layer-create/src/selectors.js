import { createStructuredSelector } from 'reselect';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';
import * as constants from './constants';


export const getInitialValues = state => ({ });


export const getOrganizations = state => denormalize(state.organizations, schemas.organizations, state.entities);


export const getCurrentFormState = state => state.form && state.form[constants.MODULE_NAME];


export const getMyself = state => denormalize(state.myself, schemas.user, state.entities);


export const getSubmitting = state => state.submitting;


export const getProps = createStructuredSelector({
  initialValues: getInitialValues,
  organizations: getOrganizations,
  myself: getMyself,
  isSubmitting: getSubmitting,
});
