import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.LAYERS_SEARCH_SUCCESS]: (state, action) => action.meta.total,
}, 0);
