import { takeEvery, fork, call, put, all, select } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import swal from 'sweetalert2';
import * as actions from './actions';
import * as selectors from './selectors';


function * watchLoadData() {
  yield takeEvery(constants.DATA_LOAD, function * loadData(action) {
    try {
      const cartogramCollectionId = action.payload;
      const res1 = yield call(apis.fetchCartogramCollection, cartogramCollectionId);
      yield put(actions.fetchCartogramCollectionSuccess(res1));

      const cartogramCollection = res1.payload;
      const { cartograms } = cartogramCollection;
      const res2 = yield all(cartograms.map(cartogram => call(apis.searchFeatures, { cartogram_id: cartogram.id })));
      yield all(res2.map(_res => put(actions.searchFeaturesSuccess(_res))));


      const res3 = yield call(apis.searchCartogramRoutes, { cartogram_collection_id: cartogramCollection.id });
      yield put(actions.searchCartogramRoutesSuccess(res3));

      yield put(actions.loadDataSuccess());
    } catch (err) {
      yield put(actions.loadDataFailed());
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchCreateCartogramRoute() {
  yield takeEvery(constants.CARTOGRAM_ROUTE_CREATE, function * createCartogramRoute(action) {
    try {
      const cartogramCollection = yield select(selectors.getCartogramCollection);
      const cartogramRoute = action.payload;
      const fullCartogramRoute = {
        ...cartogramRoute,
        cartogram_collection_id: cartogramCollection.id,
        from_feature_id: cartogramRoute.from_position && cartogramRoute.from_position[1],
        to_feature_id: cartogramRoute.to_position && cartogramRoute.to_position[1],
      };
      const res = yield call(apis.createCartogramRoute, fullCartogramRoute);
      yield put(actions.createCartogramRouteSuccess(res));
      yield call(() => swal('添加成功'));
    } catch (err) {
      yield put(actions.createCartogramRouteFailed());
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchUpdateCartogramRoute() {
  yield takeEvery(constants.CARTOGRAM_ROUTE_UPDATE, function * updateCartogramRoute(action) {
    try {
      const cartogramRoute = action.payload;
      const fullCartogramRoute = {
        ...cartogramRoute,
        from_feature_id: cartogramRoute.from_position && cartogramRoute.from_position[1],
        to_feature_id: cartogramRoute.to_position && cartogramRoute.to_position[1],
      };
      const res = yield call(apis.updateCartogramRoute, fullCartogramRoute);
      yield put(actions.updateCartogramRouteSuccess(res));
      yield call(() => swal('修改成功'));
    } catch (err) {
      yield put(actions.updateCartogramRouteFailed());
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchRemoveCartogramRoute() {
  yield takeEvery(constants.CARTOGRAM_ROUTE_REMOVE, function * removeCartogramRoute(action) {
    try {
      const cartogramRoute = action.payload;
      if (!window.confirm(`确定想要删除此路由?\n\n路由id: ${cartogramRoute.id}`)) { return; }

      yield call(apis.removeCartogramRoute, cartogramRoute);
      yield put(actions.removeCartogramRouteSuccess(cartogramRoute));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchLoadData),
    fork(watchCreateCartogramRoute),
    fork(watchUpdateCartogramRoute),
    fork(watchRemoveCartogramRoute),
  ]);
}
