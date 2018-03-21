import { combineReducers } from 'redux';
import entities from './entities';
import { reducer as form } from 'redux-form';
import cartograms from './cartograms';
import queryConditions from './query_conditions';
import loading from './loading';

export default combineReducers({
  form,
  entities,
  cartograms,
  queryConditions,
  loading,
});
