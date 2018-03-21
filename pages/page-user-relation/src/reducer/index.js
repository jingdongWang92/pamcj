import { combineReducers } from 'redux';
import entities from './entities';
import { reducer as form } from 'redux-form';
import submitting from './submitting';


export default combineReducers({
  form,
  entities,
  submitting,
});
