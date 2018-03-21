import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.CARTOGRAM_GEOREFERENCE_FETCH_SUCCESS]: (state, action) => action.payload.result,
}, null);
