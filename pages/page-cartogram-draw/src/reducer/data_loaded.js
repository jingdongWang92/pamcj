import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.DATA_LOAD_SUCCESS]: (state, action) => true,
}, false);
