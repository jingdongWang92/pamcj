import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


const DEFAULT_STATE = {
  organizations:{},
  users: {},
};


export default handleActions({
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: mergeEntities,
  [constants.USER_SELF_FETCH_SUCCESS]: mergeEntities,
}, DEFAULT_STATE);


function mergeEntities(state, action) {
  return merge(state, action.payload.entities);
}
