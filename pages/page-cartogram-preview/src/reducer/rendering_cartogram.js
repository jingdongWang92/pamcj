import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.CARTOGRAM_GEOJSON_FETCH_SUCCESS]: (state, action) => action.payload.result,
}, null);
