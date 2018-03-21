import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


export default handleActions({
  [constants.ENTITIES_RESTORE_SUCCESS]: (state, action) => action.payload,
  [constants.CARTOGRAM_FETCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.LAYERS_SEARCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.FEATURES_SEARCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.FEATURE_CREATE_SUCCESS]: mergeFeatureWhenCreateAndUpdate,
  [constants.FEATURE_UPDATE_SUCCESS]: mergeFeatureWhenCreateAndUpdate,
  [constants.CARTOGRAM_GEOREFERENCE_FETCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
}, {
  cartograms: {},
  geometryStyles: {},
  layerFields: {},
  layerFieldOptions: {},
  layers: {},
  featureFields: {},
  featureProperties: {},
  features: {},
});


function mergeFeatureWhenCreateAndUpdate(state, action) {
  const { result: featureUUID, entities } = action.payload;
  const feature = entities.features[featureUUID];

  const newState = merge(state, entities);
  newState.features[featureUUID].fields = feature.fields;
  newState.features[featureUUID].properties = feature.properties;

  // 不合并数组元素
  feature.properties.forEach(propertyId => {
    newState.featureProperties[propertyId].value = entities.featureProperties[propertyId].value;
  });

  return newState;
}
