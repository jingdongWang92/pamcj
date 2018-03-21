import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.USER_EMAIL_VERIFY_SUCCESS]: (state, action) => true,
  [constants.USER_EMAIL_VERIFY_FAILED]: (state, action) => true,
}, false);
