import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import constant from 'lodash/fp/constant';


export default handleActions({
  [constants.CARTOGRAM_ROUTE_VIEW_SUCCESS]: constant(null),
  [constants.CARTOGRAM_ROUTE_ADD_SUCCESS]: constant(null),
  [constants.CARTOGRAM_ROUTE_EDIT_SUCCESS]: (state, action) => action.payload.result,
}, null);
