import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.WXPAY_INFO_FETCH_SUCCESS]: (state, action) => action.payload,
}, null);
