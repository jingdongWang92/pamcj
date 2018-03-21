import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import constant from 'lodash/fp/constant';


export default handleActions({
  [constants.ORGANIZATION_UPDATE]: constant(true),
  [constants.ORGANIZATION_UPDATE_SUCCESS]: constant(false),
  [constants.ORGANIZATION_UPDATE_FAILED]: constant(false),
}, false);
