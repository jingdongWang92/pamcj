import { createAction } from 'redux-actions';
import * as constants from './constants';
import { normalize } from 'normalizr';
import * as schemas from './schemas';


export const fetchCartogramCollection = createAction(constants.CARTOGRAM_COLLECTION_FETCH);
export const fetchCartogramCollectionSuccess = createAction(constants.CARTOGRAM_COLLECTION_FETCH_SUCCESS,
  res => normalize(res.payload, schemas.cartogramCollection),
);
export const fetchCartogramCollectionFailed = createAction(constants.CARTOGRAM_COLLECTION_FETCH_FAILED);

export const updateCartogramCollection = createAction(constants.CARTOGRAM_COLLECTION_UPDATE);
export const updateCartogramCollectionSuccess = createAction(constants.CARTOGRAM_COLLECTION_UPDATE_SUCCESS);
export const updateCartogramCollectionFailed = createAction(constants.CARTOGRAM_COLLECTION_UPDATE_FAILED);

export const searchCartograms = createAction(constants.CARTOGRAMS_SEARCH);
export const searchCartogramsSuccess = createAction(constants.CARTOGRAMS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.cartograms),
);
export const searchCartogramsFailed = createAction(constants.CARTOGRAMS_SEARCH_FAILED);
