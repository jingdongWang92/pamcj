import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.CARTOGRAM_ROUTE_VIEW_SUCCESS]: (state, action) => 'view',
  [constants.CARTOGRAM_ROUTE_ADD_SUCCESS]: (state, action) => 'add',
  [constants.CARTOGRAM_ROUTE_EDIT_SUCCESS]: (state, action) => 'edit',
}, 'view');
