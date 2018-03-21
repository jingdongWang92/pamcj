import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import organizations from './organizations';
import entities from './entities';
import accessToken from './access_token';
import inputTips from './input_tips';
import submitting from './submitting';

export default combineReducers({
  form,
  entities,
  organizations,
  accessToken,
  inputTips,
  submitting,
});
