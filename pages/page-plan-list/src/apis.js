import request from '@jcnetwork/util-better-request';


export function searchPlans(query) {
  return request({
    method: 'get',
    endpoint: `/apis/plans`,
    query,
  });
}

export function createPlan(plan) {
  return request({
    method: 'post',
    endpoint: `/apis/plans`,
    payload: plan,
  });
}

export function updatePlan(plan) {
  return request({
    method: 'post',
    endpoint: `/apis/plans`,
    payload: plan,
  });
}

export function removePlan(plan) {
  return request({
    method: 'delete',
    endpoint: `/apis/plans/${plan.id}`,
  });
}

export function markPlanAsLevelDefault(plan) {
  return request({
    method: 'put',
    endpoint: `/apis/plans/${plan.id}/level_default`,
  });
}
