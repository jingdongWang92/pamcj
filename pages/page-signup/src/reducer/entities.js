import { handleActions } from 'redux-actions';
import * as constants from '../constants';


const DEFAULT_STATE = {};


export default handleActions({
  [constants.PROFILE_FETCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities.users,
  }),
}, DEFAULT_STATE);
