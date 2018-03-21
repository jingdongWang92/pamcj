import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import constant from 'lodash/fp/constant';


export default handleActions({
  [constants.ORGANIZATIONS_SEARCH]: constant(true),
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: constant(false),
  [constants.ORGANIZATIONS_SEARCH_FAILED]: constant(false),
  [constants.ORGANIZATION_INVITATIONS_SEARCH]: constant(true),
  [constants.ORGANIZATION_INVITATIONS_SEARCH_SUCCESS]: constant(false),
  [constants.ORGANIZATION_INVITATIONS_SEARCH_FAILED]: constant(false),
}, true);
