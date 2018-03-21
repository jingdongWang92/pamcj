import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import getOr from 'lodash/fp/getOr';


export default handleActions({
  [constants.MODE_SWITCH_SUCCESS]: (state, action) => {
    if (action.payload.startsWith(constants.MODE_DRAW)) {
      return getOr(state, 'meta.drawingLayer.id', action);
    }

    return null;
  },
}, null);
