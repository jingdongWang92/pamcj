import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import without from 'lodash/fp/without';
import union from 'lodash/fp/union';


export default handleActions({
  [constants.REMOVED_FEATURES_RESTORE_SUCCESS]: (state, action) => action.payload,
  [constants.FEATURE_REMOVE_SUCCESS]: (state, action) => union(state, [action.payload.result]),
  [constants.FEATURE_PERSIST_SUCCESS]: (state, action) => without([action.payload.result], state),
}, []);
