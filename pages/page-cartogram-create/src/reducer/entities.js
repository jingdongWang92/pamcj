import { handleActions } from 'redux-actions';
import * as constants from '../constants';


const DEFAULT_STATE = {
  cartograms: {},
  location:{},
};


export default handleActions({
  [constants.CARGOTRAMS_SEARCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities,
  }),
  [constants.LOCATION_SEARCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities,
  }),
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities,
  }),
}, DEFAULT_STATE);
