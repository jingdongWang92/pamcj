import { takeEvery, fork, put, call, all, select } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';
import * as selectors from './selectors';


export default function * rootSaga() {
  yield all([
    fork(watchSearchPlans),
    fork(watchCreatePlan),
    fork(watchUpdatePlan),
    fork(watchRemovePlan),
    fork(watchMarkPlanAsLevelDefault),
  ]);
}

function * watchSearchPlans() {
  yield takeEvery(constants.PLANS_SEARCH, function * searchPlans(action) {
    try {
      const query = action.payload;
      const res = yield call(apis.searchPlans, query);
      yield put(actions.searchPlansSuccess(res));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}

function * watchCreatePlan() {
  yield takeEvery(constants.PLAN_CREATE, function * createPlan(action) {
    try {
      const plan = action.payload;
      const res = yield call(apis.createPlan, plan);
      yield put(actions.createPlanSuccess(res));
      yield call(() => swal('操作成功'));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}

function * watchUpdatePlan() {
  yield takeEvery(constants.PLAN_UPDATE, function * updatePlan(action) {
    try {
      const plan = action.payload;
      Object.assign(plan, {
        id: null,
        is_enabled: false,
      });
      const res = yield call(apis.updatePlan, plan);
      yield put(actions.updatePlanSuccess(res));
      yield call(() => swal('操作成功'));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}

function * watchRemovePlan() {
  yield takeEvery(constants.PLAN_REMOVE, function * removePlan(action) {
    try {
      const plan = action.payload;
      yield call(apis.removePlan, plan);
      yield put(actions.removePlanSuccess(plan));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}

function * watchMarkPlanAsLevelDefault() {
  yield takeEvery(constants.PLAN_AS_LEVEL_DEFAULT_MARK, function * markLevelDefault(action) {
    try {
      const plan = action.payload;
      yield call(apis.markPlanAsLevelDefault, plan);
      const lastLevelDefaultPlan = yield select(selectors.getLastLevelDefaultPlan(plan.level));
      yield put(actions.markPlanAsLevelDefaultSuccess({
        lastLevelDefaultPlan,
        lastestLevelDefaultPlan: plan,
      }));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}
