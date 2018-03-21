import { takeEvery, fork, put, call, all, select, throttle, take } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';
import storeUtil from '@jcnetwork/storage-utils';
import * as selectors from './selectors';
import lzwCompress from 'lzwcompress';


function * watchLoadData() {
  try {
    const action = yield take(constants.DATA_LOAD);


    const user = yield call(apis.fetchUser, 'self');


    const cartogramId = action.payload;
    let {
      entities,
      features,
      createdFeatures,
      updatedFeatures,
      removedFeatures,
      layers,
      cartogram,
    } = {};
    try {
      const compressed = yield call(storeUtil.get, `${user.id}:${cartogramId}`);
      if (compressed) {
        const data = yield call(() => lzwCompress.unpack(compressed));
        ({
          entities,
          features,
          createdFeatures,
          updatedFeatures,
          removedFeatures,
          layers,
          cartogram,
        } = data);
      }
    } catch(err) {
      console.log('something wrong', err);
    }


    let resumeLastEdit = false;
    if ((createdFeatures && createdFeatures.length)
        || (updatedFeatures && updatedFeatures.length)
        || (removedFeatures && removedFeatures.length)
    ) {
      try {
        const choose = yield call(() => swal({
          title: '你有未保存的更改',
          text: '您在上一次编辑时有未保存的修改，您想恢复这些修改吗？',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: '恢复我的修改',
          cancelButtonText: '丢弃我的修改',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }));
        resumeLastEdit = choose === true;
      } catch (err) {
        resumeLastEdit = false;
      }
    }


    if (resumeLastEdit) {
      yield put(actions.restoreEntitiesSuccess(entities));


      yield put(actions.restoreCartogramSuccess(cartogram));
      yield put(actions.restoreLayersSuccess(layers));


      yield put(actions.restoreFeaturesSuccess(features));
      yield put(actions.restoreCreatedFeaturesSuccess(createdFeatures));
      yield put(actions.restoreUpdatedFeaturesSuccess(updatedFeatures));
      yield put(actions.restoreRemovedFeaturesSuccess(removedFeatures));
    } else {
      yield call(storeUtil.remove, `${user.id}:${cartogramId}`);

      const res1 = yield call(apis.searchLayers);
      yield put(actions.searchLayersSuccess(res1));


      const res2 = yield call(apis.fetchCartogram, cartogramId);
      yield put(actions.fetchCartogramSuccess(res2));


      const res3 = yield call(apis.searchFeatures, {
        cartogram_id: cartogramId,
      });
      yield put(actions.searchFeaturesSuccess(res3));

      const res4 = yield call(apis.fetchCartogramGeoreference, cartogramId);
      yield put(actions.fetchCartogramGeoreferenceSuccess(res4.payload));
    }


    yield put(actions.loadDataSuccess());
  } catch (err) {
    yield call(() => swal(err.message));
  }
}


function * watchUpdateFeature() {
  yield takeEvery(constants.FEATURE_UPDATE, function * updateFeature(action) {
    const createdFeatureUUIDs = yield select(state => state.createdFeatures);

    const isNewFeature = createdFeatureUUIDs.includes(action.payload.uuid);
    if (isNewFeature) {
      yield put(actions.createFeatureSuccess(action.payload));
    } else {
      yield put(actions.updateFeatureSuccess(action.payload));
    }
  });
}


function * watchPersistFeature() {
  yield takeEvery(constants.FEATURE_PERSIST, function * persistFeature(action) {
    try {
      const [
        createdFeatures,
        updatedFeatures,
        removedFeatures,
      ] = yield all([
        select(selectors.getCreatedFeatures),
        select(selectors.getUpdatedFeatures),
        select(selectors.getRemovedFeatures),
      ]);


      for (let feature of createdFeatures) {
        const res = yield call(apis.createFeature, feature);
        yield put(actions.persistFeatureSuccess(res.payload));
      }

      for (let feature of updatedFeatures) {
        const res = yield call(apis.updateFeature, feature);
        yield put(actions.persistFeatureSuccess(res.payload));
      }

      for (let feature of removedFeatures) {
        yield call(apis.removeFeature, feature);
        yield put(actions.persistFeatureSuccess(feature));
      }

      yield call(() => swal('保存成功'));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * persistState() {
  yield throttle(2000, '*', function * () {
    const [user, cartogram] = yield all([
      call(storeUtil.getUserInfo),
      select(selectors.getCartogram),
    ]);

    if (user && cartogram) {
      const data = yield select(state => ({
        entities: state.entities,
        features: state.features,
        createdFeatures: state.createdFeatures,
        updatedFeatures: state.updatedFeatures,
        removedFeatures: state.removedFeatures,
        layers: state.layers,
        cartogram: state.cartogram,
        points: state.points,
        lineStrings: state.lineStrings,
        polygons: state.polygons,
      }));


      if ((data.createdFeatures && data.createdFeatures.length)
          || (data.updatedFeatures && data.updatedFeatures.length)
          || (data.removedFeatures && data.removedFeatures.length)
      ) {
        try {
          yield call(storeUtil.set, `${user.id}:${cartogram.id}`, lzwCompress.pack(data));
        } catch (err) {
          console.warn(err);
        }
      } else {
        yield call(storeUtil.remove, `${user.id}:${cartogram.id}`);
      }
    }
  })
}


export default function * rootSaga() {
  yield all([
    fork(watchLoadData),
    fork(watchUpdateFeature),
    fork(watchPersistFeature),
    fork(persistState),
  ]);
}
