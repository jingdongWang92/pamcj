import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.ORDER_CREATE_SUCCESS]: (state, action) => action.payload.result,
}, null);
