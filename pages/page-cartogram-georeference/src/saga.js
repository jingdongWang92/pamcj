import { takeEvery, fork, put, call, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';


function * watchFetchCartogramGeoreference() {
  yield takeEvery(constants.CARTOGRAM_GEOREFERENCE_FETCH, function * fetchCartogramGeoreference(action) {
    try {
      const res = yield call(apis.fetchCartogramGeoreference, action.payload);
      if (!res.payload.cartogram.diagram) {
        return yield call(() => swal('警告', '此地图不包含底图', 'warning'));
      }
      yield put(actions.fetchCartogramGeoreferenceSuccess(res.payload));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchUpdateCartogramGeoreference() {
  yield takeEvery(constants.CARTOGRAM_GEOREFERENCE_UPDATE, function * updateCartogramGeoreference(action) {
    try {
      yield put(actions.submitting(true));
      yield call(apis.updateCartogramGeoreference, action.payload);
      yield call(() => swal('保存成功'));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    } finally {
      yield put(actions.submitting(false));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchFetchCartogramGeoreference),
    fork(watchUpdateCartogramGeoreference),
  ]);
}
