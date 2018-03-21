import { handleActions } from 'redux-actions';
import * as constants from '../constants';


const DEFAULT_STATE = {
  cartograms: {},
  cartogramCollections: {},
};


export default handleActions({
  [constants.CARTOGRAM_COLLECTIONS_SEARCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities,
  }),
}, DEFAULT_STATE);
