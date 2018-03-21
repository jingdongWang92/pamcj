import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.TOTAL_AMOUNT_COMPUTE]: (state, action) => action.payload,
}, 0);
