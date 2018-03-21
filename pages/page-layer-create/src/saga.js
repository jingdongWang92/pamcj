import { takeEvery, fork,call, put, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';


function * watchCreateLayer() {
  yield takeEvery(constants.LAYER_CREATE, function * createLayer(action) {
    try {
      yield put(actions.submitting(true));
      const layer = action.payload;
      yield call(apis.createLayer, layer);
      yield call(() => swal('成功', '图层添加成功', 'success'));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    } finally {
      yield put(actions.submitting(false));
    }
  });
}


function * watchSearchOrganizations() {
  yield takeEvery(constants.ORGANIZATIONS_SEARCH, function * searchOrganizations(action) {
    try {
      const query = action.payload;
      const res = yield call(apis.searchOrganizations, query);
      yield put(actions.searchOrganizationsSuccess(res.payload));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchFetchUserSelf() {
  yield takeEvery(constants.USER_SELF_FETCH, function * fetchUserSelf(action) {
    try {
      const res = yield call(apis.fetchUserSelf);
      yield put(actions.fetchUserSelfSuccess(res.payload));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchCreateLayer),
    fork(watchSearchOrganizations),
    fork(watchFetchUserSelf),
  ]);
}
