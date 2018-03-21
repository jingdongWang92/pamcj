import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.PLANS_SEARCH_SUCCESS]: (state, action) => action.payload.result,
  [constants.PLAN_CREATE_SUCCESS]: (state, action) => [...state, action.payload.result],
  [constants.PLAN_REMOVE_SUCCESS]: (state, action) => state.filter(planId => planId !== action.payload.result),
}, []);
