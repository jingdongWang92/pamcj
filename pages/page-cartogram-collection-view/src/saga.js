import { takeEvery, fork, call, put } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import request from '@jcnetwork/util-better-request';
import swal from 'sweetalert2';
import * as actions from './actions';


function * watchSearchCartograms() {
  yield takeEvery(constants.CARTOGRAMS_SEARCH, function * searchCartograms(action) {
    try {
      const api = apis.searchCartograms(action.payload);
      const res = yield call(request, api);
      yield put(actions.searchCartogramsSuccess(res));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchFetchCartogramCollection() {
  yield takeEvery(constants.CARTOGRAM_COLLECTION_FETCH, function * fetchCartogramCollection(action) {
    try {
      const cartogramCollectionId = action.payload;
      const api = apis.fetchCartogramCollection(cartogramCollectionId);
      const res = yield call(request, api);
      yield put(actions.fetchCartogramCollectionSuccess(res));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchUpdateCartogramCollection() {
  yield takeEvery(constants.CARTOGRAM_COLLECTION_UPDATE, function * updateCartogramCollection(action) {
    try {
      const cartogramCollection = action.payload;
      const api = apis.updateCartogramCollection(cartogramCollection);
      yield call(request, api);
      yield call(() => swal('修改成功'));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


export default function * rootSaga() {
  yield [
    fork(watchSearchCartograms),
    fork(watchFetchCartogramCollection),
    fork(watchUpdateCartogramCollection),
  ];
}
