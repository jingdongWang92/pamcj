import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.USER_EDIT]: (state, action) => action.payload.result,
}, null);
