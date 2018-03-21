import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.ORGANIZATION_INVITATIONS_SEARCH_SUCCESS]: (state, action) => action.payload.result,
  [constants.ORGANIZATION_INVITATION_ACCEPT_SUCCESS]: (state, action) => state.filter(invitationId => invitationId !== action.payload.result),
  [constants.ORGANIZATION_INVITATION_REJECT_SUCCESS]: (state, action) => state.filter(invitationId => invitationId !== action.payload.result),
}, []);
