import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: (state, action) => action.payload.result,
  [constants.ORGANIZATION_CREATE_SUCCESS]: (state, action) => [...state, action.payload.result],
  [constants.ORGANIZATION_REMOVE_SUCCESS]: (state, action) => state.filter(organizationId => organizationId !== action.payload.result),
  [constants.ORGANIZATION_QUIT_SUCCESS]: (state, action) => state.filter(organizationId => organizationId !== action.payload.result),
}, []);
