import { takeEvery, fork, call, put, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import swal from 'sweetalert2';
import * as actions from './actions';


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

function * watchCreateCartogramCollection() {
  yield takeEvery(constants.CARTOGRAM_COLLECTION_CREATE, function * createCartogramCollection(action) {
    try {
      yield put(actions.submitting(true));
      const cartogramCollection = action.payload;
      const res = yield call(apis.createCartogramCollection, cartogramCollection);
      yield put(actions.createCartogramCollectionSuccess(res));
      yield call(() => swal('成功', '项目创建成功', 'success'));
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
      yield put(actions.searchOrganizationsSuccess(res));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchSearchCartograms),
    fork(watchCreateCartogramCollection),
    fork(watchSearchOrganizations),
  ]);
}
