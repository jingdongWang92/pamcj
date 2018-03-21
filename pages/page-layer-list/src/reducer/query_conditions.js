import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


export default handleActions({
  [constants.LAYERS_SEARCH_SUCCESS]: (state, action) => merge(state, {
    pagination: {
      total: action.meta.total,
    },
  }),
  [constants.QUERY_CONDITION_CHANGE_SUCCESS]: (state,action) => merge(state, action.payload),
}, {
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  filters: {},
  sorter: {},
});
