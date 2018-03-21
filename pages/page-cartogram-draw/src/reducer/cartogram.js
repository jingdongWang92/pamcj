import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.CARTOGRAM_RESTORE_SUCCESS]: (state, action) => action.payload,
  [constants.CARTOGRAM_FETCH_SUCCESS]: (state, action) => action.payload.result,
}, null);
