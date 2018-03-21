import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import constant from 'lodash/fp/constant';


export default handleActions({
  [constants.CARTOGRAM_ROUTE_UPDATE]: constant(true),
  [constants.CARTOGRAM_ROUTE_UPDATE_SUCCESS]: constant(false),
  [constants.CARTOGRAM_ROUTE_UPDATE_FAILED]: constant(false),
}, false);
