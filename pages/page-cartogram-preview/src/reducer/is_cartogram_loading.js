import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.CARTOGRAM_GEOJSON_FETCH]: (state, action) => true,
  [constants.CARTOGRAM_GEOJSON_FETCH_SUCCESS]: (state, action) => false,
  [constants.CARTOGRAM_GEOJSON_FETCH_FAILED]: (state, action) => false,
}, false);
