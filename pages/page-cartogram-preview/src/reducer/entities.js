import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


const DEFAULT_STATE = {
  cartograms: {},
  cartogramGeojsons: {},
};


export default handleActions({
  [constants.CARTOGRAMS_SEARCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.CARTOGRAM_GEOJSON_FETCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
}, DEFAULT_STATE);
