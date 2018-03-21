import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.LAYERS_SEARCH_SUCCESS]: (state, action) => action.payload.result,
  [constants.LAYER_REMOVE_SUCCESS]: (state, action) => state.filter(layerId => layerId !== action.payload.id),
}, []);
