import { combineReducers } from 'redux';
import entities from './entities';
import { reducer as form } from 'redux-form';
import cartograms from './cartograms';
import organizations from './organizations';
import submitting from './submitting';

export default combineReducers({
  form,
  entities,
  cartograms,
  organizations,
  submitting,
});
