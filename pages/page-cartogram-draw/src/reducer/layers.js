import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.LAYERS_RESTORE_SUCCESS]: (state, action) => action.payload,
  [constants.LAYERS_SEARCH_SUCCESS]: (state, action) => action.payload.result,
}, []);
