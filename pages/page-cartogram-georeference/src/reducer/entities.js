import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/fp/merge';


export default handleActions({
  [constants.CARTOGRAM_GEOREFERENCE_FETCH_SUCCESS]: (state, action) => merge(state, action.payload.entities),
  [constants.CARTOGRAM_GEOREFERENCE_ADJUST_SUCCESS]: (state, action) => merge(state, action.payload.entities),
}, {
  cartograms: {},
  cartogramGeoreferences: {},
});
