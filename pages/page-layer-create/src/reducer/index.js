import { combineReducers } from 'redux';
import entities from './entities';
import { reducer as form } from 'redux-form';
import organizations from './organizations';
import myself from './myself';
import submitting from './submitting';


export default combineReducers({
  form,
  entities,
  organizations,
  myself,
  submitting,
});
