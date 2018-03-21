import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const searchCartograms = createAction(constants.CARTOGRAMS_SEARCH);
export const searchCartogramsSuccess = createAction(constants.CARTOGRAMS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.cartograms),
  res => res.meta,
);
export const searchCartogramsFailed = createAction(constants.CARTOGRAMS_SEARCH_FAILED);

export const removeCartogram = createAction(constants.CARTOGRAM_REMOVE);
export const removeCartogramSuccess = createAction(constants.CARTOGRAM_REMOVE_SUCCESS);
export const removeCartogramFailed = createAction(constants.CARTOGRAM_REMOVE_FAILED);

export const changeQueryCondition = createAction(constants.QUERY_CONDITION_CHANGE);
export const changeQueryConditionSuccess = createAction(constants.QUERY_CONDITION_CHANGE_SUCCESS);
export const changeQueryConditionFailed = createAction(constants.QUERY_CONDITION_CHANGE_FAILED);

export const changeLoading = createAction(constants.CHANGE_LOADING);
