import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


const DEFAULT_STATE = {
  users: {},
  organizations: {},
  plans: {},
  orders: {},
};


export default handleActions({
  [constants.USER_INFO_FETCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.PLAN_BY_LEVEL_FETCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.ORDER_CREATE_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.ORDER_FETCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
}, DEFAULT_STATE);
