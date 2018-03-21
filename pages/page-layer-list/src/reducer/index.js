import { combineReducers } from 'redux';
import entities from './entities';
import layers from './layers';
import layerTotal from './layer_total';
import queryConditions from './query_conditions';
import loading from './loading';

export default combineReducers({
  entities,
  layers,
  layerTotal,
  queryConditions,
  loading,
});
