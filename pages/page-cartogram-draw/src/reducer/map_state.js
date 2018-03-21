import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.MODE_SWITCH_SUCCESS]: (state, action) => action.payload,
}, constants.MODE_VIEW);
