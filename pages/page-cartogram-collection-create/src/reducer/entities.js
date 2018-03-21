import { handleActions } from 'redux-actions';
import * as constants from '../constants';


const DEFAULT_STATE = {
  cartograms: {},
};


export default handleActions({
  [constants.CARTOGRAMS_SEARCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities,
  }),
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities,
  }),
}, DEFAULT_STATE);
