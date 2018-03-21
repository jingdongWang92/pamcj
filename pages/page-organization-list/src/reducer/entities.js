import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


const DEFAULT_STATE = {
  organizations: {},
  users: {},
};


export default handleActions({
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.ORGANIZATION_CREATE_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.ORGANIZATION_UPDATE_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.ORGANIZATION_MEMBERS_SEARCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.ORGANIZATION_INVITATIONS_SEARCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.USER_SELF_FETCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
}, DEFAULT_STATE);
