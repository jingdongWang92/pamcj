import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.FEATURE_SELECT_SUCCESS]: (state, action) => action.payload.result,
  [constants.FEATURE_DESELECT_SUCCESS]: () => null,
  [constants.FEATURE_REMOVE_SUCCESS]: (state, action) => state && state.id === action.payload.result.id ? null : state,
}, 'fd97165a-bc40-41ae-8b83-23ca19de79da');
