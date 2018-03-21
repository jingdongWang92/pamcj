import { handleActions } from 'redux-actions';
import * as constants from '../constants';

export default handleActions({
  [constants.PLAN_BY_LEVEL_FETCH_SUCCESS]: (state, action) => {
    const planLevel = action.payload.entities.plans[action.payload.result].level;

    return {
      ...state,
      [planLevel]: action.payload.result, 
    }
  },
}, {});
