import { takeEvery, fork, put, call, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';


function * watchSearchCartograms() {
  yield takeEvery(constants.CARTOGRAMS_SEARCH, function * searchCartograms(action) {
    try {
      yield put(actions.changeLoading(true));
      const query = action.payload;
      const res = yield call(apis.searchCartograms, query);
      yield put(actions.searchCartogramsSuccess(res));
      yield put(actions.changeLoading(false));
    } catch (err) {
      yield put(actions.searchCartogramsFailed(err));
    }
  });
}

function * watchRemoveCartogram() {
  yield takeEvery(constants.CARTOGRAM_REMOVE, function * removeCartogram(action) {
    if (!window.confirm('确定删除此地图？')) { return; }
    try {
      const cartogram = action.payload;
      yield call(apis.removeCartogram, cartogram);
      yield put(actions.removeCartogramSuccess(cartogram));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}

export default function * rootSaga() {
  yield all([
    fork(watchSearchCartograms),
    fork(watchRemoveCartogram),
  ]);
}
