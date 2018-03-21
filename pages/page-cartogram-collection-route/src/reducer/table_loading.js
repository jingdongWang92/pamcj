import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import constant from 'lodash/fp/constant';


export default handleActions({
  [constants.DATA_LOAD]: constant(true),
  [constants.DATA_LOAD_SUCCESS]: constant(false),
  [constants.DATA_LOAD_FAILED]: constant(false),
}, true);
