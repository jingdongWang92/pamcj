import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.CARTOGRAM_COLLECTIONS_SEARCH_SUCCESS]: (state, action) => action.payload.result,
  [constants.CARTOGRAM_COLLECTION_REMOVE_SUCCESS]: (state, action) => state.filter(id => id !== action.payload.id),
}, []);
