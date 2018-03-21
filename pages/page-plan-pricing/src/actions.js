import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const fetchUserInfo = createAction(constants.USER_INFO_FETCH);
export const fetchUserInfoSuccess = createAction(constants.USER_INFO_FETCH_SUCCESS,
  res => normalize(res.payload, schemas.user),
);
export const fetchUserInfoFailed = createAction(constants.USER_INFO_FETCH_FAILED);

export const fetchPlanByLevel = createAction(constants.PLAN_BY_LEVEL_FETCH);
export const fetchPlanByLevelSuccess = createAction(constants.PLAN_BY_LEVEL_FETCH_SUCCESS,
  res => normalize(res.payload, schemas.plan),
);
export const fetchPlanByLevelFailed = createAction(constants.PLAN_BY_LEVEL_FETCH_FAILED);

export const selectPlan = createAction(constants.PLAN_SELECT);
export const selectPlanSuccess = createAction(constants.PLAN_SELECT_SUCCESS,
  plan => normalize(plan, schemas.plan),
);
export const selectPlanFailed = createAction(constants.PLAN_SELECT_FAILED);

export const unselectPlan = createAction(constants.PLAN_UNSELECT);
export const unselectPlanSuccess = createAction(constants.PLAN_UNSELECT_SUCCESS);
export const unselectPlanFailed = createAction(constants.PLAN_UNSELECT_FAILED);

export const createOrder = createAction(constants.ORDER_CREATE);
export const createOrderSuccess = createAction(constants.ORDER_CREATE_SUCCESS,
  res => normalize(res.payload, schemas.order),
);
export const createOrderFailed = createAction(constants.ORDER_CREATE_FAILED);

export const selectPayMethod = createAction(constants.PAY_METHOD_SELECT);
export const selectPayMethodSuccess = createAction(constants.PAY_METHOD_SELECT_SUCCESS);
export const selectPayMethodFailed = createAction(constants.PAY_METHOD_SELECT_FAILED);

export const unselectPayMethod = createAction(constants.PAY_METHOD_UNSELECT);
export const unselectPayMethodSuccess = createAction(constants.PAY_METHOD_UNSELECT_SUCCESS);
export const unselectPayMethodFailed = createAction(constants.PAY_METHOD_UNSELECT_FAILED);

export const selectOrganization = createAction(constants.ORGANIZATION_SELECT);
export const selectOrganizationSuccess = createAction(constants.ORGANIZATION_SELECT_SUCCESS,
  organization => normalize(organization, schemas.organization),
);
export const selectOrganizationFailed = createAction(constants.ORGANIZATION_SELECT_FAILED);

export const unselectOrganization = createAction(constants.ORGANIZATION_UNSELECT);
export const unselectOrganizationSuccess = createAction(constants.ORGANIZATION_UNSELECT_SUCCESS);
export const unselectOrganizationFailed = createAction(constants.ORGANIZATION_UNSELECT_FAILED);

export const validatePayment = createAction(constants.PAYMENT_VALIDATE);
export const validatePaymentSuccess = createAction(constants.PAYMENT_VALIDATE_SUCCESS);
export const validatePaymentFailed = createAction(constants.PAYMENT_VALIDATE_FAILED);

export const fetchWxpayInfo = createAction(constants.WXPAY_INFO_FETCH);
export const fetchWxpayInfoSuccess = createAction(constants.WXPAY_INFO_FETCH_SUCCESS);
export const fetchWxpayInfoFailed = createAction(constants.WXPAY_INFO_FETCH_FAILED);

export const checkoutWithAlipay = createAction(constants.WITH_ALIPAY_CHECKOUT);
export const checkoutWithAlipaySuccess = createAction(constants.WITH_ALIPAY_CHECKOUT_SUCCESS);
export const checkoutWithAlipayFailed = createAction(constants.WITH_ALIPAY_CHECKOUT_FAILED);

export const checkoutWithWxpay = createAction(constants.WITH_WXPAY_CHECKOUT);
export const checkoutWithWxpaySuccess = createAction(constants.WITH_WXPAY_CHECKOUT_SUCCESS);
export const checkoutWithWxpayFailed = createAction(constants.WITH_WXPAY_CHECKOUT_FAILED);

export const fetchOrder = createAction(constants.ORDER_FETCH);
export const fetchOrderSuccess = createAction(constants.ORDER_FETCH_SUCCESS,
  res => normalize(res.payload, schemas.order),
);
export const fetchOrderFailed = createAction(constants.ORDER_FETCH_FAILED);

export const searchOrganizations = createAction(constants.ORGANIZATIONS_SEARCH);
export const searchOrganizationsSuccess = createAction(constants.ORGANIZATIONS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.organizations),
);
export const searchOrganizationsFailed = createAction(constants.ORGANIZATIONS_SEARCH_FAILED);
