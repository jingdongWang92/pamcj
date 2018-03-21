import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/merge';


const DEFAULT_STATE = {
  cartogramCollections: {},
  cartograms: {},
  cartogramRoutes: {},
  features: {},
  layers: {},
};


export default handleActions({
  [constants.CARTOGRAM_COLLECTION_FETCH_SUCCESS]: mergeEntities,
  [constants.FEATURES_SEARCH_SUCCESS]: mergeEntities,
  [constants.CARTOGRAM_ROUTE_CREATE_SUCCESS]: mergeEntities,
  [constants.CARTOGRAM_ROUTES_SEARCH_SUCCESS]: mergeEntities,
  [constants.CARTOGRAM_ROUTE_UPDATE_SUCCESS]: mergeEntities,
}, DEFAULT_STATE);


function mergeEntities(state, action) {
  return merge({}, state, action.payload.entities);
}
