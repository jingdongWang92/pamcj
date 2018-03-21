import { combineReducers } from 'redux';
import entities from './entities';
import { reducer as form } from 'redux-form';
import cartogramCollection from './cartogram_collection';
import cartograms from './cartograms';


export default combineReducers({
  form,
  entities,
  cartogramCollection,
  cartograms,
});
