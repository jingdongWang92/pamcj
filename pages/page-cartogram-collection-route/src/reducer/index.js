import { combineReducers } from 'redux';
import entities from './entities';
import cartogramCollection from './cartogram_collection';
import cartogramRoutes from './cartogram_routes';
import features from './features';
import mode from './mode';
import tablePagination from './table_pagination';
import tableLoading from './table_loading';
import { reducer as form } from 'redux-form';
import isCreating from './is_creating';
import isUpdating from './is_updating';
import edittingCartogramRoute from './editting_cartogram_route';


export default combineReducers({
  form,
  entities,
  cartogramCollection,
  features,
  cartogramRoutes,
  mode,
  tablePagination,
  tableLoading,
  isCreating,
  isUpdating,
  edittingCartogramRoute,
});
