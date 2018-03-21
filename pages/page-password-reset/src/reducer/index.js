import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import token from './token';

export default combineReducers({
  form,
  token,
});
