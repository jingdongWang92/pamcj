import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


const DEFAULT_STATE = {
  plans: {},
};


export default handleActions({
  [constants.PLANS_SEARCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.PLAN_CREATE_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.PLAN_UPDATE_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.PLAN_AS_LEVEL_DEFAULT_MARK_SUCCESS]: (state, action) => {
    const {
      lastLevelDefaultPlan,
      lastestLevelDefaultPlan,
    } = action.payload;

    const newState = {
      ...state,
      plans: {
        ...state.plans,
        [lastestLevelDefaultPlan.id]: merge(lastestLevelDefaultPlan, {
          is_level_default: true,
        }),
      }
    };
    if (lastLevelDefaultPlan) {
      newState.plans[lastLevelDefaultPlan.id] = merge(lastLevelDefaultPlan, {
        is_level_default: false,
      });
    }

    return newState;
  },
}, DEFAULT_STATE);
