import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


const DEFAULT_STATE = {
  organizations: {},
  cartograms: {},
};


export default handleActions({
  [constants.CARTOGRAM_FETCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
}, DEFAULT_STATE);
