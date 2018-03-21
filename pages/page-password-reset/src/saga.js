import { takeEvery, call, fork,select, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import swal from 'sweetalert2';


function * watchResetPassword() {
  yield takeEvery(constants.PASSWORD_RESET, function * resetPassword(action) {
    try {
      const payload = action.payload;
      const token = yield select(function(state) {
        return state.token;
      })
      Object.assign(payload,{
        token: token,
      });

      yield call(apis.resetPassword, payload);
      yield call(() => swal('成功', `密码重置成功,请重新登录`, 'success'));

      yield call(() => window.location.href = '/login');
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}

export default function * rootSaga() {
  yield all([
    fork(watchResetPassword),
  ]);
}
