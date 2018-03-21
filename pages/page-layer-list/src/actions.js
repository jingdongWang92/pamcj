import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const searchLayers = createAction(constants.LAYERS_SEARCH);
export const searchLayersSuccess = createAction(constants.LAYERS_SEARCH_SUCCESS,
    res => normalize(res.payload, schemas.layers),
    res => res.meta,
);
export const searchLayersFailed = createAction(constants.LAYERS_SEARCH_FAILED);


export const removeLayer = createAction(constants.LAYER_REMOVE);
export const removeLayerSuccess = createAction(constants.LAYER_REMOVE_SUCCESS);
export const removeLayerFailed = createAction(constants.LAYER_REMOVE_FAILED);


export const changeQueryCondition = createAction(constants.QUERY_CONDITION_CHANGE);
export const changeQueryConditionSuccess = createAction(constants.QUERY_CONDITION_CHANGE_SUCCESS);
export const changeQueryConditionFailed = createAction(constants.QUERY_CONDITION_CHANGE_FAILED);


export const changeLoading = createAction(constants.CHANGE_LOADING);
