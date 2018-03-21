import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const searchCartograms = createAction(constants.CARTOGRAMS_SEARCH,);
export const searchCartogramsSuccess = createAction(
  constants.CARTOGRAMS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.cartograms),
  res => res.meta,
);
export const searchCartogramsFailed = createAction(constants.CARTOGRAMS_SEARCH_FAILED);

export const fetchCartogramGeojson = createAction(constants.CARTOGRAM_GEOJSON_FETCH);
export const fetchCartogramGeojsonSuccess = createAction(
  constants.CARTOGRAM_GEOJSON_FETCH_SUCCESS,
  cartogramGeojson => normalize(cartogramGeojson, schemas.cartogramGeojson),
);
export const fetchCartogramGeojsonFailed = createAction(constants.CARTOGRAM_GEOJSON_FETCH_FAILED);
