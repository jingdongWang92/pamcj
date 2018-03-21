import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const searchPlans = createAction(constants.PLANS_SEARCH);
export const searchPlansSuccess = createAction(constants.PLANS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.plans),
  res => res.meta,
);
export const searchPlansFailed = createAction(constants.PLANS_SEARCH_FAILED);

export const createPlan = createAction(constants.PLAN_CREATE);
export const createPlanSuccess = createAction(constants.PLAN_CREATE_SUCCESS,
  res => normalize(res.payload, schemas.plan),
);
export const createPlanFailed = createAction(constants.PLAN_CREATE_FAILED);

export const updatePlan = createAction(constants.PLAN_UPDATE);
export const updatePlanSuccess = createAction(constants.PLAN_UPDATE_SUCCESS,
  res => normalize(res.payload, schemas.plan),
);
export const updatePlanFailed = createAction(constants.PLAN_UPDATE_FAILED);

export const removePlan = createAction(constants.PLAN_REMOVE);
export const removePlanSuccess = createAction(constants.PLAN_REMOVE_SUCCESS,
  plan => normalize(plan, schemas.plan),
);
export const removePlanFailed = createAction(constants.PLAN_REMOVE_FAILED);

export const editPlan = createAction(constants.PLAN_EDIT,
  plan => normalize(plan, schemas.plan),
);

export const markPlanAsLevelDefault = createAction(constants.PLAN_AS_LEVEL_DEFAULT_MARK);
export const markPlanAsLevelDefaultSuccess = createAction(constants.PLAN_AS_LEVEL_DEFAULT_MARK_SUCCESS);
export const markPlanAsLevelDefaultFailed = createAction(constants.PLAN_AS_LEVEL_DEFAULT_MARK_FAILED);
