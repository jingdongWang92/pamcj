import { takeEvery, fork,call, put, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';


function * watchFetchLayer() {
  yield takeEvery(constants.LAYER_FETCH, function * fetchLayer(action) {
    try {
      const layerId = action.payload;
      const res = yield call(apis.fetchLayer, layerId);
      yield put(actions.fetchLayerSuccess(res));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchUpdateLayer() {
  yield takeEvery(constants.LAYER_UPDATE, function * updateLayer(action) {
    try {
      const layer = action.payload;
      yield call(apis.updateLayer, layer);
      yield call(() => swal('修改成功'));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchFetchLayer),
    fork(watchUpdateLayer),
  ]);
}
