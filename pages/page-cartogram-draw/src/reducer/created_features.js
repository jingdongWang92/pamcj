import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import union from 'lodash/fp/union';
import without from 'lodash/fp/without';


export default handleActions({
  [constants.CREATED_FEATURES_RESTORE_SUCCESS]: (state, action) => action.payload,
  [constants.FEATURE_CREATE_SUCCESS]: (state, action) => union(state, [action.payload.result]),
  [constants.FEATURE_REMOVE_SUCCESS]: (state, action) => without([action.payload.result], state),
  [constants.FEATURE_PERSIST_SUCCESS]: (state, action) => without([action.payload.result], state),
}, []);
