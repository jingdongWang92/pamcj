import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.ORGANIZATION_SELECT_SUCCESS]: (state, action) => action.payload.result,
  [constants.ORGANIZATION_UNSELECT_SUCCESS]: (state, action) => null,
}, null);
