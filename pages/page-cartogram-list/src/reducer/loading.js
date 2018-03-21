import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.CHANGE_LOADING]: (state, action) => action.payload,
}, true);
