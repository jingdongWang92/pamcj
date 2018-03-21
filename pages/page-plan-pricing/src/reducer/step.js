import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.PLAN_UNSELECT_SUCCESS]: (state, action) => null,
  [constants.PLAN_SELECT_SUCCESS]: (state, action) => 1,
  [constants.ORDER_CREATE_SUCCESS]: (state, action) => 2,
  [constants.WXPAY_INFO_FETCH_SUCCESS]: (state, action) => 3,
  [constants.PAYMENT_VALIDATE_SUCCESS]: (state, action) => 4,
}, null);
