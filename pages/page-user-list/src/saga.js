import { fork, put, call, takeEvery, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';
import storage from '@jcnetwork/storage-utils';


function * watchSearchUsers() {
  yield takeEvery(constants.USERS_SEARCH, function * searchUsers(action) {
    try {
      const query = action.payload;
      const res = yield call(apis.searchUsers, query);
      yield put(actions.searchUsersSuccess(res));
    } catch (err) {
      yield put(actions.searchUsersFailed(err));
    }
  });
}


function * watchSearchPlans() {
  yield takeEvery(constants.PLANS_SEARCH, function * searchPlans(action) {
    try {
      const query = action.payload;
      const res = yield call(apis.searchPlans, query);
      yield put(actions.searchPlansSuccess(res));
    } catch (err) {
      yield put(actions.searchPlansFailed(err));
    }
  });
}


function * watchUpdateUser() {
  yield takeEvery(constants.USER_UPDATE, function * updateUser(action) {
    try {
      const user = action.payload;
      const res = yield call(apis.updateUser, user);
      yield put(actions.updateUserSuccess(res));
      yield call(() => swal('成功'));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchSendRegisterEmail() {
  yield takeEvery(constants.REGISTER_EMAIL_SEND, function * sendRegisterEmail(action) {
    const user = action.payload;

    try {
      yield call(apis.sendRegisterEmail, user);
      yield put(actions.sendRegisterEmailSuccess(user));
      yield call(() => swal('发送成功'));
    } catch (err) {
      yield put(actions.sendRegisterEmailFailed(user));
      yield call(() => swal(err.message));
    }
  });
}


function * watchFetchUserSelf() {
  yield takeEvery(constants.USER_SELF_FETCH, function * fetchUserSelf(action) {
    try {
      const res = yield call(apis.fetchUserSelf);
      yield put(actions.fetchUserSelfSuccess(res.payload));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchImpersonateUser() {
  yield takeEvery(constants.USER_IMPERSONATE, function * impersonateUser(action) {
    const user = action.payload;

    try {
      const res = yield call(apis.impersonateUser, user);
      const { access_token } = res.payload;
      const realToken = yield call(storage.getToken);
      yield call(storage.set, 'impersonate', true);
      yield call(storage.set, 'real_token', realToken);
      yield call(storage.setToken, access_token);
      yield call(() => window.location.reload());
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchSearchUsers),
    fork(watchSearchPlans),
    fork(watchUpdateUser),
    fork(watchSendRegisterEmail),
    fork(watchFetchUserSelf),
    fork(watchImpersonateUser),
  ]);
}
