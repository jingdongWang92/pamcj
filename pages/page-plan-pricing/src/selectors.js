import { createStructuredSelector } from 'reselect';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';
import {
  LEVEL_0,
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
} from '@jcmap/constant-plan-levels';


export const getUser = state => denormalize(state.user, schemas.user, state.entities);

export const getPlanByLevel = planLevel => state => denormalize(state.plans[planLevel], schemas.plan, state.entities);

export const getPlanLevel0 = getPlanByLevel(LEVEL_0);

export const getPlanLevel1 = getPlanByLevel(LEVEL_1);

export const getPlanLevel2 = getPlanByLevel(LEVEL_2);

export const getPlanLevel3 = getPlanByLevel(LEVEL_3);

export const getSelectedPlan = state => denormalize(state.selectedPlan, schemas.plan, state.entities);

export const getSelectedPayMethod = state => state.selectedPayMethod;

export const getOrder = state => denormalize(state.order, schemas.order, state.entities);

export const getWxpayInfo = state => state.wxpayInfo;

export const getSelectedOrganization = state => denormalize(state.selectedOrganization, schemas.organization, state.entities);

export const getStep = state => state.step;

export const getOrganizations = state => denormalize(state.organizations, schemas.organizations, state.entities);

export const mapStateToProps = createStructuredSelector({
  user: getUser,
  planLevel0: getPlanLevel0,
  planLevel1: getPlanLevel1,
  planLevel2: getPlanLevel2,
  planLevel3: getPlanLevel3,
  selectedPlan: getSelectedPlan,
  selectedPayMethod: getSelectedPayMethod,
  selectedOrganization: getSelectedOrganization,
  order: getOrder,
  wxpayInfo: getWxpayInfo,
  step: getStep,
  organizations: getOrganizations,
});
