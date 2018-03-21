import { combineReducers } from 'redux';
import entities from './entities';
import { reducer as form } from 'redux-form';
import cartogramCollections from './cartogram_collections';
import accessToken from './access_token';


export default combineReducers({
  form,
  entities,
  cartogramCollections,
  accessToken,
});
