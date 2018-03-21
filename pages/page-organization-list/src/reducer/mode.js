import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.ORGANIZATION_VIEW_SUCCESS]: (state, action) => action.type,
  [constants.ORGANIZATION_ADD_SUCCESS]: (state, action) => action.type,
  [constants.ORGANIZATION_EDIT_SUCCESS]: (state, action) => action.type,
  [constants.ORGANIZATION_INVITATION_ADD_SUCCESS]: (state, action) => action.type,
  [constants.ORGANIZATION_NAME_EDIT_SUCCESS]: (state, action) => action.type,
}, constants.ORGANIZATION_VIEW_SUCCESS);
