import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.USERS_SEARCH_SUCCESS]: (state, action) => ({ ...state, total: action.meta.total }),
}, {
  pageSize: 10,
  current: 1,
  total: 0,
});
