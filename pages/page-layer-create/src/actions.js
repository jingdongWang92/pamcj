import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const createLayer = createAction(constants.LAYER_CREATE);
export const createLayerSuccess = createAction(constants.LAYER_CREATE_SUCCESS);
export const createLayerFailed = createAction(constants.LAYER_CREATE_FAILED);


export const searchOrganizations = createAction(constants.ORGANIZATIONS_SEARCH);
export const searchOrganizationsSuccess = createAction(constants.ORGANIZATIONS_SEARCH_SUCCESS,
  organizations => normalize(organizations, schemas.organizations),
);
export const searchOrganizationsFailed = createAction(constants.ORGANIZATIONS_SEARCH_FAILED);


export const fetchUserSelf = createAction(constants.USER_SELF_FETCH);
export const fetchUserSelfSuccess = createAction(constants.USER_SELF_FETCH_SUCCESS,
  user => normalize(user, schemas.user),
);
export const fetchUserSelfFailed = createAction(constants.USER_SELF_FETCH_FAILED);


export const submitting = createAction(constants.SUBMITTING);
