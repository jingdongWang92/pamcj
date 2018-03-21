import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.PAY_METHOD_SELECT_SUCCESS]: (state, action) => action.payload,
  [constants.PAY_METHOD_UNSELECT_SUCCESS]: (state, action) => null,
}, null);
