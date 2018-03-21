import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.LAYER_FETCH_SUCCESS]: (state, action) => action.payload.result,
}, null);
