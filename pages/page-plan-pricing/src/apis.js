import request from '@jcnetwork/util-better-request';


export function fetchUserInfo() {
  return request({
    method: 'get',
    endpoint: `/apis/users/self`,
  });
}


export function fetchPlanByLevel(planLevel) {
  return request({
    method: 'get',
    endpoint: `/apis/plans/${planLevel}`,
  });
}


export function createOrder(plan, organization) {
  return request({
    method: 'post',
    endpoint: `/apis/orders`,
    payload: {
      plan_id: plan.id,
      organization_id: organization.id,
      buyer_id: organization.id,
    },
  });
}


export function fetchWxpayInfo(order) {
  return request({
    method: 'get',
    endpoint: `/apis/pay/wxpay`,
    query: {
      out_trade_no: order.trade_no,
      trade_amount: order.trade_amount,
      subject: order.merchandise_name,
      body: '地图工具方案',
      product_id: order.id,
    },
  });
}


export function searchOrganizations(query) {
  return request({
    method: 'get',
    endpoint: `/apis/organizations`,
    query,
  });
}


export function fetchOrder(orderId) {
  return request({
    method: 'get',
    endpoint: `/apis/orders/${orderId}`,
  });
}
