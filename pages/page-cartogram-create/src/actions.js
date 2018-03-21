import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const createCartogram = createAction(constants.CARTOGRAM_CREATE);
export const createCartogramSuccess = createAction(constants.CARTOGRAM_CREATE_SUCCESS);
export const createCartogramFailed = createAction(constants.CARTOGRAM_CREATE_FAILED);

export const searchLocation = createAction(constants.LOCATION_SEARCH);
export const searchLocationSuccess = createAction(constants.LOCATION_SEARCH_SUCCESS);
export const searchLocationFailed = createAction(constants.LOCATION_SEARCH_FAILED);

export const searchOrganizations = createAction(constants.ORGANIZATIONS_SEARCH);
export const searchOrganizationsSuccess = createAction(constants.ORGANIZATIONS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.organizations),
  res => res.meta,
);
export const searchOrganizationsFailed = createAction(constants.ORGANIZATIONS_SEARCH_FAILED);

export const searchInputTips = createAction(constants.INPUT_TIPS_SEARCH);
export const searchInputTipsSuccess = createAction(constants.INPUT_TIPS_SEARCH_SUCCESS);
export const searchInputTipsFailed = createAction(constants.INPUT_TIPS_SEARCH_FAILED);

export const selectInputTip = createAction(constants.INPUT_TIP_SELECT);
export const selectInputTipSuccess = createAction(constants.INPUT_TIP_SELECT_SUCCESS);
export const selectInputTipFailed = createAction(constants.INPUT_TIP_SELECT_FAILED);

export const submitting = createAction(constants.SUBMITTING);
