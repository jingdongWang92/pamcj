import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


const DEFAULT_STATE = {
  users: {},
  plans: {},
};


export default handleActions({
  [constants.USERS_SEARCH_SUCCESS]: mergeEntities,
  [constants.PLANS_SEARCH_SUCCESS]: mergeEntities,
  [constants.USER_UPDATE_SUCCESS]: mergeEntities,
  [constants.USER_SELF_FETCH_SUCCESS]: mergeEntities,
}, DEFAULT_STATE);


function mergeEntities(state, action) {
  return merge(state, action.payload.entities);
}
