import { takeEvery, fork, call, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import storage from '@jcnetwork/storage-utils';
import swal from 'sweetalert2';
import qs from 'qs';


function * watchLogin() {
  yield takeEvery(constants.LOGIN, function * login(action) {
    try {
      const loginInfo = action.payload;
      const res = yield call(apis.fetchToken, loginInfo);
      const { access_token } = res.payload;
      yield call(storage.setToken, access_token);

      const query = qs.parse(window.location.search.slice(1));
      const redirect = query['redirect_uri'] || query['redirect-uri'] || query['redirect_url'] || query['redirect-url'] || '/cartogram-collection/list';
      yield call(() => window.location.href = redirect);
    } catch (err) {
      yield call(() => swal('错误', '用户名或密码错误', 'error'));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchLogin),
  ]);
}
