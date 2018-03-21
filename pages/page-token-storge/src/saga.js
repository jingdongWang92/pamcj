import { takeEvery, fork, call, all } from 'redux-saga/effects';
import * as constants from './constants';
import storage from '@jcnetwork/storage-utils';
import swal from 'sweetalert2';


function * watchStorgeToken() {
  yield takeEvery(constants.TOKEN_STORGE, function * storgeToken(action) {
    try {
        const accessToken = action.payload;
        yield call(storage.setToken, accessToken);
       yield call(() => window.location.href = '/cartogram-collection/list');
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchStorgeToken),
  ]);
}
