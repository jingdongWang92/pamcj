import { combineReducers } from 'redux';
import entities from './entities';
import cartograms from './cartograms';
import renderingCartogram from './rendering_cartogram';
import isCartogramLoading from './is_cartogram_loading';


export default combineReducers({
  entities,
  cartograms,
  renderingCartogram,
  isCartogramLoading,
});
