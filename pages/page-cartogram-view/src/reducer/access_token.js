import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.ACCESS_TOKEN_READ_SUCCESS]: (state, action) => action.payload,
}, null);
