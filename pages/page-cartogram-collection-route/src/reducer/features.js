import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.FEATURES_SEARCH_SUCCESS]: (state, action) => [...state, ...action.payload.result],
}, []);
