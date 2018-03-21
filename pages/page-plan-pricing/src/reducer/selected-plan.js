import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.PLAN_SELECT_SUCCESS]: (state, action) => action.payload.result,
  [constants.PLAN_UNSELECT_SUCCESS]: (state, action) => null,
}, null);
