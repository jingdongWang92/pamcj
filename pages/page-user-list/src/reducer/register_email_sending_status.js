import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import omit from 'lodash/fp/omit';
import set from 'lodash/fp/set';


export default handleActions({
  [constants.REGISTER_EMAIL_SEND]: (state, action) => set(action.payload.id, 'sending', state),
  [constants.REGISTER_EMAIL_SEND_SUCCESS]: (state,action) => omit(action.payload.id, state),
  [constants.REGISTER_EMAIL_SEND_FAILED]: (state,action) => omit(action.payload.id, state),
}, {});
