import { takeEvery, fork, put, call, all, select } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import * as selectors from './selectors';
import swal from 'sweetalert2';


export default function * rootSaga() {
  yield all([
    fork(watchFetchUserInfo),
    fork(watchFetchPlanByLevel),
    fork(watchCreateOrder),
    fork(watchValidatePayment),
    fork(watchSearchOrganizations),
    fork(watchCheckoutWithAlipay),
    fork(watchCheckoutWithWxpay),
  ]);
}

function * watchFetchUserInfo() {
  yield takeEvery(constants.USER_INFO_FETCH, function * fetchUserInfo(action) {
    try {
      const res = yield call(apis.fetchUserInfo);
      yield put(actions.fetchUserInfoSuccess(res));

      const owner = res.payload;
      yield put(actions.searchOrganizations({ owner_id: owner.id }));
    } catch (err) {
      // 如果有错误发生，最大的可能是尚未登录
    }
  });
}

function * watchFetchPlanByLevel() {
  yield takeEvery(constants.PLAN_BY_LEVEL_FETCH, function * fetchPlanByLevel(action) {
    try {
      const planLevel = action.payload;
      const res = yield call(apis.fetchPlanByLevel, planLevel);
      yield put(actions.fetchPlanByLevelSuccess(res));
    } catch (err) {
      // 如果有任何错误发生，页面不会变成可购买状态，不影响继续浏览
    }
  });
}

function * watchCreateOrder() {
  yield takeEvery(constants.ORDER_CREATE, function * createOrder(action) {
    try {
      const selectedPlan = yield select(selectors.getSelectedPlan);
      if (!selectedPlan) {
        throw new Error('尚未选择想要购买的plan');
      }
      const selectedOrganization = yield select(selectors.getSelectedOrganization);
      if (!selectedOrganization) {
        throw new Error('未选择为谁购买');
      }

      const res = yield call(apis.createOrder, selectedPlan, selectedOrganization);
      yield put(actions.createOrderSuccess(res));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}

function * watchCheckoutWithAlipay() {
  yield takeEvery(constants.WITH_ALIPAY_CHECKOUT, function * checkoutWithAlipay(action) {
    const checkoutWindow = window.open('/checkout-loading.html');

    try {
      const order = yield select(selectors.getOrder);
      if (!order) {
        throw new Error('订单尚未生成');
      }


      const origin = process.env.NODE_ENV === 'production' ? window.location.origin : 'https://jcmap.jcbel.com';

      const params = new window.URLSearchParams();
      params.append('out_trade_no', order.trade_no);
      params.append('trade_amount', order.trade_amount);
      params.append('subject', order.merchandise_name);
      params.append('body', '地图工具方案');

      const checkoutUrl = `${origin}/apis/pay/alipay/page-pay?${params.toString()}`;
      checkoutWindow.location.href = checkoutUrl;

      yield put(actions.validatePayment(order));
    } catch (err) {
      checkoutWindow.close();
      yield call(() => swal(err.message));
    }
  });
}

function * watchCheckoutWithWxpay() {
  yield takeEvery(constants.WITH_WXPAY_CHECKOUT, function * checkoutWithWxpay(action) {
    try {
      const order = yield select(selectors.getOrder);
      if (!order) {
        throw new Error('订单尚未生成');
      }
      const res = yield call(apis.fetchWxpayInfo, order);
      if (res.error) {
        throw new Error(res.message);
      }
      yield put(actions.fetchWxpayInfoSuccess(res.payload));
      yield put(actions.validatePayment(order));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}

function * watchValidatePayment() {
  yield takeEvery(constants.PAYMENT_VALIDATE, function * validatePayment(action) {
    try {
      const order = action.payload;
      yield call(() => {
        return new Promise((resolve, reject) => {
          const timer = window.setInterval(async () => {
            const _res = await apis.fetchOrder(order.id);
            if (_res.payload.payed_at) {
              window.clearInterval(timer);
              resolve(_res);
            }
          }, 1000);
        });
      });
      yield put(actions.validatePaymentSuccess());
    } catch (err) {
      // ignore any error
    }
  });
}

function * watchSearchOrganizations() {
  yield takeEvery(constants.ORGANIZATIONS_SEARCH, function * searchOrganizations(action) {
    try {
      const query = action.payload;
      const res = yield call(apis.searchOrganizations, query);
      yield put(actions.searchOrganizationsSuccess(res));
    } catch (err) {
      // ignore any error
    }
  });
}
