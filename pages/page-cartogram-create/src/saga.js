import { delay } from 'redux-saga';
import { takeEvery, fork,put, call, all, takeLatest } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import swal from 'sweetalert2';
import { change } from 'redux-form';
import * as actions from './actions';


export default function * rootSaga() {
  yield all([
    fork(watchCreateCartogram),
    fork(watchSearchOrganizations),
    fork(watchSearchLocation),
    fork(watchSearchInputTips),
    fork(watchSelectInputTip),
  ]);
}

function * watchCreateCartogram() {
  yield takeEvery(constants.CARTOGRAM_CREATE, function * createCartogram(action) {
    try {
      yield put(actions.submitting(true));
      const cartogram = action.payload;
      yield call(apis.createCartogram, cartogram);
      yield call(() => swal('创建成功'));
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

function * watchSearchLocation() {
  yield takeLatest(constants.INPUT_TIPS_SEARCH, function * searchInputTips(action) {
    try {
      yield call(delay, 200);

      const query = action.payload;
      const res = yield call(apis.searchLocation, query);
      const location = {
        type: 'Point',
        coordinates: [
          Number.parseFloat(res.payload.location.longitude),
          Number.parseFloat(res.payload.location.latitude),
        ]
      };
      yield put(change(constants.MODULE_NAME, 'location', location));
    } catch (err) {
      // yield call(() => swal('错误', err.message, 'error'));
    }
  });
}

function * watchSearchInputTips() {
  yield takeLatest(constants.INPUT_TIPS_SEARCH, function * searchInputTips(action) {
    try {
      yield call(delay, 200);

      const query = action.payload;
      const res = yield call(apis.searchInputTips, query);
      yield put(actions.searchInputTipsSuccess(res.payload));
    } catch (err) {
      // yield call(() => swal('错误', err.message, 'error'));
    }
  });
}

function * watchSelectInputTip() {
  yield takeEvery(constants.INPUT_TIP_SELECT, function * selectInputTip(action) {
    try {
      const inputTip = action.payload;
      const coordinates = inputTip.location.split(',').map(Number.parseFloat);
      const location = {
        type: 'Point',
        coordinates,
      };
      yield put(change(constants.MODULE_NAME, 'location', location));
    } catch (err) {
      // yield call(() => swal('错误', err.message, 'error'));
    }
  });
}
