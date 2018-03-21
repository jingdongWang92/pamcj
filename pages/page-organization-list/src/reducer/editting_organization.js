import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.ORGANIZATION_EDIT_SUCCESS]: (state, action) => action.payload.result,
  [constants.ORGANIZATION_NAME_EDIT_SUCCESS]: (state, action) => action.payload.result,
}, null);
