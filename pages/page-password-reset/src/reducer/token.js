import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.FETCH_TOKEN]: (state, action) => action.payload,
}, null);
