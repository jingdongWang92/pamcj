import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: (state, action) => action.payload.result,
}, []);
