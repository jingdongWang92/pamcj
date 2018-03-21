import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.SUBMITTING]: (state, action) => action.payload,
}, false);
