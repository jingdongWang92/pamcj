import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import constant from 'lodash/fp/constant';


export default handleActions({
  [constants.CARTOGRAM_ROUTE_CREATE]: constant(true),
  [constants.CARTOGRAM_ROUTE_CREATE_SUCCESS]: constant(false),
  [constants.CARTOGRAM_ROUTE_CREATE_FAILED]: constant(false),
}, false);
