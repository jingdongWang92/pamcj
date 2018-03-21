import { createAction } from 'redux-actions';
import * as constants from './constants';
import { normalize } from 'normalizr';
import * as schemas from './schemas';


export const fetchCartogram = createAction(constants.CARTOGRAM_FETCH);
export const fetchCartogramSuccess = createAction(constants.CARTOGRAM_FETCH_SUCCESS,
  res => normalize(res.payload, schemas.cartogram),
);
export const fetchCartogramFailed = createAction(constants.CARTOGRAM_FETCH_FAILED);

export const updateCartogram = createAction(constants.CARTOGRAM_UPDATE);
export const updateCartogramSuccess = createAction(constants.CARTOGRAM_UPDATE_SUCCESS);
export const updateCartogramFailed = createAction(constants.CARTOGRAM_UPDATE_FAILED);

export const searchLocation = createAction(constants.LOCATION_SEARCH);
export const searchLocationSuccess = createAction(constants.LOCATION_SEARCH_SUCCESS);
export const searchLocationFailed = createAction(constants.LOCATION_SEARCH_FAILED);

export const searchOrganizations = createAction(constants.ORGANIZATIONS_SEARCH);
export const searchOrganizationsSuccess = createAction(constants.ORGANIZATIONS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.organizations),
  res => res.meta,
);
export const searchOrganizationsFailed = createAction(constants.ORGANIZATIONS_SEARCH_FAILED);

export const readAccessToken = createAction(constants.ACCESS_TOKEN_READ);
export const readAccessTokenSuccess = createAction(constants.ACCESS_TOKEN_READ_SUCCESS);
export const readAccessTokenFailed = createAction(constants.ACCESS_TOKEN_READ_FAILED);

export const searchInputTips = createAction(constants.INPUT_TIPS_SEARCH);
export const searchInputTipsSuccess = createAction(constants.INPUT_TIPS_SEARCH_SUCCESS);
export const searchInputTipsFailed = createAction(constants.INPUT_TIPS_SEARCH_FAILED);

export const selectInputTip = createAction(constants.INPUT_TIP_SELECT);
export const selectInputTipSuccess = createAction(constants.INPUT_TIP_SELECT_SUCCESS);
export const selectInputTipFailed = createAction(constants.INPUT_TIP_SELECT_FAILED);

export const submitting = createAction(constants.SUBMITTING);
