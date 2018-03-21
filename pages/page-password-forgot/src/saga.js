import { takeEvery, call, fork, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import swal from 'sweetalert2';


function * watchResetPassword() {
  yield takeEvery(constants.PASSWORD_RESET, function * resetPassword(action) {
    try {
      const email = action.payload;
      yield call(apis.resetPassword, email);
      yield call(() => swal('成功', `邮件已经发送,请注意查收`, 'success'));
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
