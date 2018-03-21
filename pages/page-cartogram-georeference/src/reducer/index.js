import { combineReducers } from 'redux';
import entities from './entities';
import cartogramGeoreference from './cartogram-georeference';
import { reducer as form } from 'redux-form';
import submitting from './submitting';


export default combineReducers({
  form,
  entities,
  cartogramGeoreference,
  submitting,
});
