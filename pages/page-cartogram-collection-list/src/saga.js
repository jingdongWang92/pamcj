import { takeEvery, fork, put, call, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';
import { getToken } from '@jcnetwork/storage-utils';


function * watchSearchCartogramCollections() {
  yield takeEvery(constants.CARTOGRAM_COLLECTIONS_SEARCH, function * searchCartogramCollections(action) {
    try {
      const query = action.payload;
      const res = yield call(apis.searchCartogramCollections, query);
      yield put(actions.searchCartogramCollectionsSuccess(res));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchRemoveCartogramCollection() {
  yield takeEvery(constants.CARTOGRAM_COLLECTION_REMOVE, function * removeCartogramCollection(action) {
    try {
      const cartogramCollection = action.payload;
      yield call(apis.removeCartogramCollection, cartogramCollection);
      yield put(actions.removeCartogramCollectionSuccess(cartogramCollection));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchReadAccessToken() {
  yield takeEvery(constants.ACCESS_TOKEN_READ, function * readAccessToken(action) {
    try {
      const accessToken = yield call(getToken);
      yield put(actions.readAccessTokenSuccess(accessToken));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchSearchCartogramCollections),
    fork(watchRemoveCartogramCollection),
    fork(watchReadAccessToken),
  ]);
}
