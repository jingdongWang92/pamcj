import { takeEvery, fork, call, put, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import request from '@jcnetwork/util-better-request';
import swal from 'sweetalert2';
import * as actions from './actions';


function * watchFetchGeometryStyle() {
  yield takeEvery(constants.GEOMETRY_STYLE_FETCH, function * fetchGeometryStyle(action) {
    try {
      const geometryStyleId = action.payload;
      const api = apis.fetchGeometryStyle(geometryStyleId);
      const res = yield call(request, api);
      yield put(actions.fetchGeometryStyleSuccess(res));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchUpdateGeometryStyle() {
  yield takeEvery(constants.GEOMETRY_STYLE_UPDATE, function * updateGeometryStyle(action) {
    try {
      const geometryStyle = action.payload;
      const api = apis.updateGeometryStyle(geometryStyle);
      yield call(request, api);
      yield call(() => swal('修改成功'));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchFetchGeometryStyle),
    fork(watchUpdateGeometryStyle),
  ]);
}
