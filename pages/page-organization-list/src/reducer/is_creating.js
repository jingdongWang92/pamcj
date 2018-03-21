import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import constant from 'lodash/fp/constant';


export default handleActions({
  [constants.ORGANIZATION_CREATE]: constant(true),
  [constants.ORGANIZATION_CREATE_SUCCESS]: constant(false),
  [constants.ORGANIZATION_CREATE_FAILED]: constant(false),
}, false);
