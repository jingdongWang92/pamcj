import { takeEvery, fork, call, all, put } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import storage from '@jcnetwork/storage-utils';
import URL from '@jcnetwork/util-uri';
import * as actions from './actions';


function * watchVerifyUserEmail() {
  yield takeEvery(constants.USER_EMAIL_VERIFY, function * verifyUserEmail(action) {
    try {
      const query = (new URL()).query(true);
      const email = query.email;
      if (!email) { throw new Error('no email in query string'); }

      const accessToken = query.token;
      if (!accessToken) { throw new Error('no access token in query string'); }

      yield call(storage.setToken, accessToken);

      const res = yield call(apis.fetchUserSelf);
      const user = res.payload;
      yield call(apis.markUserEmailVerified, user);

      yield put(actions.verifyUserEmailSuccess());
    } catch (err) {
      yield put(actions.verifyUserEmailFailed());
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchVerifyUserEmail),
  ]);
}
