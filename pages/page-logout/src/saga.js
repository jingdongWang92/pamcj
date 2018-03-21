import { takeEvery, fork, call, all } from 'redux-saga/effects';
import * as constants from './constants';
import storage from '@jcnetwork/storage-utils';
import swal from 'sweetalert2';


function * watchLogout() {
  yield takeEvery(constants.LOGOUT, function * logout(action) {
    try {
      const impersonate = yield call(storage.get, 'impersonate');
      if(impersonate) {
        const realToken = yield call(storage.get, 'real_token');
        yield call(storage.setToken, realToken);
        yield call(storage.remove, 'impersonate');
        yield call(storage.remove, 'real_token');
        yield call(() => window.history.go(-1));
      } else {
        yield call(() => window.location.href = '/login');
      }
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchLogout),
  ]);
}
