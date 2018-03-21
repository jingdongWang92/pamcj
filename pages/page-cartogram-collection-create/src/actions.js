import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const createCartogramCollection = createAction(constants.CARTOGRAM_COLLECTION_CREATE);
export const createCartogramCollectionSuccess = createAction(constants.CARTOGRAM_COLLECTION_CREATE_SUCCESS);
export const createCartogramCollectionFailed = createAction(constants.CARTOGRAM_COLLECTION_CREATE_FAILED);

export const searchCartograms = createAction(constants.CARTOGRAMS_SEARCH,);
export const searchCartogramsSuccess = createAction(constants.CARTOGRAMS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.cartograms),
  res => res.meta,
);
export const searchCartogramsFailed = createAction(constants.CARTOGRAMS_SEARCH_FAILED);

export const searchOrganizations = createAction(constants.ORGANIZATIONS_SEARCH);
export const searchOrganizationsSuccess = createAction(constants.ORGANIZATIONS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.organizations),
  res => res.meta,
);
export const searchOrganizationsFailed = createAction(constants.ORGANIZATIONS_SEARCH_FAILED);

export const submitting = createAction(constants.SUBMITTING);
