import { combineReducers } from 'redux';
import entities from './entities';
import { reducer as form } from 'redux-form';
import geometryStyle from './geometry_style';

export default combineReducers({
  form,
  entities,
  geometryStyle,
});
