import { combineReducers } from 'redux';
import entities from './entities';
import features from './features';
import layers from './layers';
import cartogram from './cartogram';
import dataLoaded from './data_loaded';
import createdFeatures from './created_features';
import updatedFeatures from './updated_features';
import removedFeatures from './removed_features';
import selectedFeature from './selected_feature';
import drawingLayer from './drawing_layer';
import cartogramGeoreference from './cartogram_georeference';
import mapState from './map_state';


export default combineReducers({
  dataLoaded,
  entities,

  mapState,

  cartogram,
  cartogramGeoreference,

  layers,
  drawingLayer,

  features,
  createdFeatures,
  updatedFeatures,
  removedFeatures,
  selectedFeature,
});
