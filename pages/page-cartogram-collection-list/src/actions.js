import { createAction } from 'redux-actions';
import * as constants from './constants';
import { normalize } from 'normalizr';
import * as schemas from './schemas';


export const searchCartogramCollections = createAction(constants.CARTOGRAM_COLLECTIONS_SEARCH);
export const searchCartogramCollectionsSuccess = createAction(constants.CARTOGRAM_COLLECTIONS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.cartogramCollections),
  res => res.meta,
);
export const searchCartogramCollectionsFailed = createAction(constants.CARTOGRAM_COLLECTIONS_SEARCH_FAILED);


export const removeCartogramCollection = createAction(constants.CARTOGRAM_COLLECTION_REMOVE);
export const removeCartogramCollectionSuccess = createAction(constants.CARTOGRAM_COLLECTION_REMOVE_SUCCESS);
export const removeCartogramCollectionFailed = createAction(constants.CARTOGRAM_COLLECTION_REMOVE_FAILED);


export const readAccessToken = createAction(constants.ACCESS_TOKEN_READ);
export const readAccessTokenSuccess = createAction(constants.ACCESS_TOKEN_READ_SUCCESS);
export const readAccessTokenFailed = createAction(constants.ACCESS_TOKEN_READ_FAILED);
