import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import merge from 'lodash/merge';


const DEFAULT_STATE = {
  layers: {},
};


export default handleActions({
  [constants.LAYERS_SEARCH_SUCCESS]: (state, action) => merge({}, state, action.payload.entities),
}, DEFAULT_STATE);
