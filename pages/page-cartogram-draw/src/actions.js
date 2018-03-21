import { createAction } from 'redux-actions';
import * as constants from './constants';
import { normalize } from 'normalizr';
import * as schemas from './schemas';


export const fetchCartogram = createAction(constants.CARTOGRAM_FETCH);
export const fetchCartogramSuccess = createAction(constants.CARTOGRAM_FETCH_SUCCESS,
  res => normalize(res.payload, schemas.cartogram),
);
export const fetchCartogramFailed = createAction(constants.CARTOGRAM_FETCH_FAILED);


export const searchLayers = createAction(constants.LAYERS_SEARCH);
export const searchLayersSuccess = createAction(constants.LAYERS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.layers),
);
export const searchLayersFailed = createAction(constants.LAYERS_SEARCH_FAILED);


export const updateFeature = createAction(constants.FEATURE_UPDATE);
export const updateFeatureSuccess = createAction(constants.FEATURE_UPDATE_SUCCESS,
  feature => normalize(feature, schemas.feature),
);
export const updateFeatureFailed = createAction(constants.FEATURE_UPDATE_FAILED);


export const searchFeatures = createAction(constants.FEATURES_SEARCH);
export const searchFeaturesSuccess = createAction(constants.FEATURES_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.features),
);
export const searchFeaturesFailed = createAction(constants.FEATURES_SEARCH_FAILED);


export const selectFeature = createAction(constants.FEATURE_SELECT);
export const selectFeatureSuccess = createAction(constants.FEATURE_SELECT_SUCCESS,
  feature => normalize(feature, schemas.feature),
);
export const selectFeatureFailed = createAction(constants.FEATURE_SELECT_FAILED);


export const deselectFeature = createAction(constants.FEATURE_DESELECT);
export const deselectFeatureSuccess = createAction(constants.FEATURE_DESELECT_SUCCESS);
export const deselectFeatureFailed = createAction(constants.FEATURE_DESELECT_FAILED);


export const removeFeature = createAction(constants.FEATURE_REMOVE);
export const removeFeatureSuccess = createAction(constants.FEATURE_REMOVE_SUCCESS,
  feature => normalize(feature, schemas.feature),
);
export const removeFeatureFailed = createAction(constants.FEATURE_REMOVE_FAILED);


export const loadData = createAction(constants.DATA_LOAD);
export const loadDataSuccess = createAction(constants.DATA_LOAD_SUCCESS);
export const loadDataFailed = createAction(constants.DATA_LOAD_FAILED);


export const createFeature = createAction(constants.FEATURE_CREATE);
export const createFeatureSuccess = createAction(constants.FEATURE_CREATE_SUCCESS,
  feature => normalize(feature, schemas.feature),
);
export const createFeatureFailed = createAction(constants.FEATURE_CREATE_FAILED);


export const switchMapState = createAction(constants.MODE_SWITCH);
export const switchMapStateSuccess = createAction(constants.MODE_SWITCH_SUCCESS,
  args => args.mapState,
  args => args.params,
);
export const switchMapStateFailed = createAction(constants.MODE_SWITCH_FAILED);


export const restoreEntities = createAction(constants.ENTITIES_RESTORE);
export const restoreEntitiesSuccess = createAction(constants.ENTITIES_RESTORE_SUCCESS);
export const restoreEntitiesFailed = createAction(constants.ENTITIES_RESTORE_FAILED);


export const restoreCartogram = createAction(constants.CARTOGRAM_RESTORE);
export const restoreCartogramSuccess = createAction(constants.CARTOGRAM_RESTORE_SUCCESS);
export const restoreCartogramFailed = createAction(constants.CARTOGRAM_RESTORE_FAILED);


export const restoreLayers = createAction(constants.LAYERS_RESTORE);
export const restoreLayersSuccess = createAction(constants.LAYERS_RESTORE_SUCCESS);
export const restoreLayersFailed = createAction(constants.LAYERS_RESTORE_FAILED);


export const restoreFeatures = createAction(constants.FEATURES_RESTORE);
export const restoreFeaturesSuccess = createAction(constants.FEATURES_RESTORE_SUCCESS);
export const restoreFeaturesFailed = createAction(constants.FEATURES_RESTORE_FAILED);


export const restoreCreatedFeatures = createAction(constants.CREATED_FEATURES_RESTORE);
export const restoreCreatedFeaturesSuccess = createAction(constants.CREATED_FEATURES_RESTORE_SUCCESS);
export const restoreCreatedFeaturesFailed = createAction(constants.CREATED_FEATURES_RESTORE_FAILED);


export const restoreUpdatedFeatures = createAction(constants.UPDATED_FEATURES_RESTORE);
export const restoreUpdatedFeaturesSuccess = createAction(constants.UPDATED_FEATURES_RESTORE_SUCCESS);
export const restoreUpdatedFeaturesFailed = createAction(constants.UPDATED_FEATURES_RESTORE_FAILED);


export const restoreRemovedFeatures = createAction(constants.REMOVED_FEATURES_RESTORE);
export const restoreRemovedFeaturesSuccess = createAction(constants.REMOVED_FEATURES_RESTORE_SUCCESS);
export const restoreRemovedFeaturesFailed = createAction(constants.REMOVED_FEATURES_RESTORE_FAILED);


export const persistFeature = createAction(constants.FEATURE_PERSIST);
export const persistFeatureSuccess = createAction(constants.FEATURE_PERSIST_SUCCESS,
  feature => normalize(feature, schemas.feature),
);
export const persistFeatureFailed = createAction(constants.FEATURE_PERSIST_FAILED);


export const fetchCartogramGeoreference = createAction(constants.CARTOGRAM_GEOREFERENCE_FETCH);
export const fetchCartogramGeoreferenceSuccess = createAction(constants.CARTOGRAM_GEOREFERENCE_FETCH_SUCCESS,
  cartogramGeoreference => normalize(cartogramGeoreference, schemas.cartogramGeoreference),
);
export const fetchCartogramGeoreferenceFailed = createAction(constants.CARTOGRAM_GEOREFERENCE_FETCH_FAILED);
