import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


export default handleActions({
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: (state, action) => merge(state, {total: action.meta.total }),
  [constants.ORGANIZATION_CREATE_SUCCESS]: (state, action) => merge(state, {total: state.total + 1}),
  [constants.ORGANIZATION_REMOVE_SUCCESS]: (state, action) => merge(state, {total: state.total - 1}),
  [constants.ORGANIZATION_QUIT_SUCCESS]: (state, action) => merge(state, {total: state.total - 1}),
  [constants.TABLE_PAGINATION_CHANGE_SUCCESS]: (state, action) => action.payload,
}, {
  pageSize: 10,
  current: 1,
  total: 0,
});
