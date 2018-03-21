import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.MODAL_OPEN]: (state, action) => true,
  [constants.MODAL_CLOSE]: (state, action) => false,
}, false);
