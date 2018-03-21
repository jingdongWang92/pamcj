import { takeEvery, fork, call, put, all, select } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import swal from 'sweetalert2';
import * as actions from './actions';
import * as selectors from './selectors';


export default function * rootSaga() {
  yield all([
    fork(watchSearchCartograms),
    fork(watchFetchCartogramGeojson),
  ]);
}

function * watchSearchCartograms() {
  yield takeEvery(constants.CARTOGRAMS_SEARCH, function * searchCartograms(action) {
    try {
      const res = yield call(apis.searchCartograms, action.payload);
      yield put(actions.searchCartogramsSuccess(res));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}

function * watchFetchCartogramGeojson() {
  yield takeEvery(constants.CARTOGRAM_GEOJSON_FETCH, function * fetchCartogramGeojson(action) {
    try {
      const cartogramId = action.payload;
      let cartogramGeojson = yield select(selectors.getCartogramGeojson(cartogramId));
      if (!cartogramGeojson) {
        cartogramGeojson = yield call(apis.fetchCartogramGeojson, cartogramId);
      }
      yield put(actions.fetchCartogramGeojsonSuccess(cartogramGeojson));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}
