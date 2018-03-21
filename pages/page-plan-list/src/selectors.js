import { createStructuredSelector, createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';


export const getPlans = state => denormalize(state.plans, schemas.plans, state.entities);

export const getEdittingPlan = state => denormalize(state.edittingPlan, schemas.plan, state.entities);

export const getLastLevelDefaultPlan = planLevel => createSelector(
  getPlans,
  (plans) => plans.find(plan => plan.level === planLevel && plan.is_level_default),
);

export const mapStateToProps = createStructuredSelector({
  plans: getPlans,
  edittingPlan: getEdittingPlan,
});
