import { takeEvery, fork,call, put, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';


function * watchFetchProfile() {
  yield takeEvery(constants.PROFILE_FETCH, function * fetchProfile(action) {
    try {
      const query = action.payload;
      const res = yield call(apis.fetchProfile, query);
      yield put(actions.fetchProfileSuccess(res));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}

function * watchUpdateProfile() {
  yield takeEvery(constants.PROFILE_UPDATE, function * updateProfile(action) {
    try {
      const profile = action.payload;
      yield call(apis.updateProfile, profile);
      yield call(() => swal('成功','资料修改成功','success'));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchSearchOrders() {
  yield takeEvery(constants.ORDERS_SEARCH, function * searchOrders(action) {
    try {
      const query = action.payload;
      const res = yield call(apis.searchOrders, query);
      yield put(actions.searchOrdersSuccess(res));
    } catch (err) {
      yield put(actions.searchOrdersFailed(err));
    }
  });
}

function * watchSearchInvoices() {
  yield takeEvery(constants.INVOICES_SEARCH, function * searchInvoices(action) {
    try {
      const query = action.payload;
      const res = yield call(apis.searchInvoices, query);
      yield put(actions.searchInvoicesSuccess(res));
    } catch (err) {
      yield put(actions.searchInvoicesFailed(err));
    }
  });
}

function * watchCreateInvoice() {
  yield takeEvery(constants.INVOICE_CREATE, function * createInvoice(action) {
    try {
      const invoice = action.payload;
      yield call(apis.createInvoice, invoice);
      yield call(() => swal('成功','发票申请成功','success'));
      yield put(actions.closeModal());
      const redirect = '/user/profile';
      yield call(() => window.location.href = redirect);
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}

function * watchResetPassword() {
  yield takeEvery(constants.PASSWORD_RESET, function * resetPassword(action) {
    try {
      const payload = action.payload;
      yield call(apis.resetPassword, payload);
      yield call(() => swal('成功', `密码重置成功`, 'success'));

    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}

export default function * rootSaga() {
  yield all([
    fork(watchFetchProfile),
    fork(watchUpdateProfile),
    fork(watchSearchOrders),
    fork(watchSearchInvoices),
    fork(watchCreateInvoice),
    fork(watchResetPassword),
  ]);
}
