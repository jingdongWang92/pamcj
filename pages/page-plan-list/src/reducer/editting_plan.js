import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.PLAN_EDIT]: (state, action) => action.payload.result,
}, null);
