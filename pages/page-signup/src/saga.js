import { takeEvery, fork, call, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import swal from 'sweetalert2';



function * watchRegisteUser() {
  yield takeEvery(constants.USER_REGISTE, function * registeUser(action) {
    try {
      const payload = action.payload;
      const { password, password_confirm } = payload;

      if (!password) {
        throw new Error('请输入密码');
      }

      if (password !== password_confirm) {
        throw new Error('密码不一致');
      }

      yield call(apis.registeUser, payload);
      yield call(() => swal('成功', '注册成功', 'success'));
      yield call(() => window.location.href = '/login');
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}

export default function * rootSaga() {
  yield all([
    fork(watchRegisteUser),
  ]);
}
