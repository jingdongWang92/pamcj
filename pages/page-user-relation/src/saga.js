import { takeEvery, fork, call, all, put } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';


function * watchBindAccount() {
  yield takeEvery(constants.ACCOUNT_BIND, function * bindAccount(action) {
    try {
      yield put(actions.submitting(true));
      const payload = action.payload;
      const res = yield call(apis.bindAccount, payload);
      const redirect = `/token-storge#?access_token=${res.payload}`
      yield call(() => window.location.href = redirect);
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    } finally {
      yield put(actions.submitting(false));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchBindAccount),
  ]);
}
