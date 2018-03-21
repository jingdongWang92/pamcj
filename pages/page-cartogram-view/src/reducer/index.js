import { combineReducers } from 'redux';
import entities from './entities';
import { reducer as form } from 'redux-form';
import cartogram from './cartogram';
import organizations from './organizations';
import accessToken from './access_token';
import inputTips from './input_tips';
import submitting from './submitting';


export default combineReducers({
  form,
  entities,
  cartogram,
  organizations,
  accessToken,
  inputTips,
  submitting,
});
