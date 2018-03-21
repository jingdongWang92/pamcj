import { takeEvery, fork, put, call, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';


function * watchSearchLayers() {
  yield takeEvery(constants.LAYERS_SEARCH, function * searchLayers(action) {
    try {
      yield put(actions.changeLoading(true));
      const query = action.payload;
      const res = yield call(apis.searchLayers, query);
      yield put(actions.searchLayersSuccess(res));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    } finally {
      yield put(actions.changeLoading(false));
    }
  });
}


function * watchRemoveLayer() {
  yield takeEvery(constants.LAYER_REMOVE, function * removeLayer(action) {
    try {
      const layer = action.payload;
      yield call(apis.removeLayer, layer);
      yield put(actions.removeLayerSuccess(layer));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchSearchLayers),
    fork(watchRemoveLayer),
  ]);
}
