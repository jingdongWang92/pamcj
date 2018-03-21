import { combineReducers } from 'redux';
import entities from './entities';
import { reducer as form } from 'redux-form';
import layer from './layer';


export default combineReducers({
  form,
  entities,
  layer,
});
