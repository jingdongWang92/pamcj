import { createAction } from 'redux-actions';
import * as constants from './constants';
import { normalize } from 'normalizr';
import * as schemas from './schemas';


export const loadData = createAction(constants.DATA_LOAD);
export const loadDataSuccess = createAction(constants.DATA_LOAD_SUCCESS);
export const loadDataFailed = createAction(constants.DATA_LOAD_FAILED);


export const fetchCartogramCollection = createAction(constants.CARTOGRAM_COLLECTION_FETCH);
export const fetchCartogramCollectionSuccess = createAction(constants.CARTOGRAM_COLLECTION_FETCH_SUCCESS,
  res => normalize(res.payload, schemas.cartogramCollection),
);
export const fetchCartogramCollectionFailed = createAction(constants.CARTOGRAM_COLLECTION_FETCH_FAILED);


export const searchCartogramRoutes = createAction(constants.CARTOGRAM_ROUTES_SEARCH);
export const searchCartogramRoutesSuccess = createAction(constants.CARTOGRAM_ROUTES_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.cartogramRoutes),
  res => res.meta,
);
export const searchCartogramRoutesFailed = createAction(constants.CARTOGRAM_ROUTES_SEARCH_FAILED);


export const viewCartogramRoute = createAction(constants.CARTOGRAM_ROUTE_VIEW);
export const viewCartogramRouteSuccess = createAction(constants.CARTOGRAM_ROUTE_VIEW_SUCCESS);
export const viewCartogramRouteFailed = createAction(constants.CARTOGRAM_ROUTE_VIEW_FAILED);


export const addCartogramRoute = createAction(constants.CARTOGRAM_ROUTE_ADD);
export const addCartogramRouteSuccess = createAction(constants.CARTOGRAM_ROUTE_ADD_SUCCESS);
export const addCartogramRouteFailed = createAction(constants.CARTOGRAM_ROUTE_ADD_FAILED);


export const createCartogramRoute = createAction(constants.CARTOGRAM_ROUTE_CREATE);
export const createCartogramRouteSuccess = createAction(constants.CARTOGRAM_ROUTE_CREATE_SUCCESS,
  res => normalize(res.payload, schemas.cartogramRoute),
);
export const createCartogramRouteFailed = createAction(constants.CARTOGRAM_ROUTE_CREATE_FAILED);


export const editCartogramRoute = createAction(constants.CARTOGRAM_ROUTE_EDIT);
export const editCartogramRouteSuccess = createAction(constants.CARTOGRAM_ROUTE_EDIT_SUCCESS,
  cartogramRoute => normalize(cartogramRoute, schemas.cartogramRoute),
);
export const editCartogramRouteFailed = createAction(constants.CARTOGRAM_ROUTE_EDIT_FAILED);


export const updateCartogramRoute = createAction(constants.CARTOGRAM_ROUTE_UPDATE);
export const updateCartogramRouteSuccess = createAction(constants.CARTOGRAM_ROUTE_UPDATE_SUCCESS,
  res => normalize(res.payload, schemas.cartogramRoute),
);
export const updateCartogramRouteFailed = createAction(constants.CARTOGRAM_ROUTE_UPDATE_FAILED);


export const removeCartogramRoute = createAction(constants.CARTOGRAM_ROUTE_REMOVE);
export const removeCartogramRouteSuccess = createAction(constants.CARTOGRAM_ROUTE_REMOVE_SUCCESS);
export const removeCartogramRouteFailed = createAction(constants.CARTOGRAM_ROUTE_REMOVE_FAILED);


export const searchFeatures = createAction(constants.FEATURES_SEARCH);
export const searchFeaturesSuccess = createAction(constants.FEATURES_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.features),
);
export const searchFeaturesFailed = createAction(constants.FEATURES_SEARCH_FAILED);


export const changeTablePagination = createAction(constants.TABLE_PAGINATION_CHANGE);
export const changeTablePaginationSuccess = createAction(constants.TABLE_PAGINATION_CHANGE_SUCCESS);
export const changeTablePaginationFailed = createAction(constants.TABLE_PAGINATION_CHANGE_FAILED);
