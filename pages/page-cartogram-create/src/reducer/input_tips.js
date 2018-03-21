import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import uniq from 'lodash/fp/uniq';


export default handleActions({
  [constants.INPUT_TIPS_SEARCH_SUCCESS]: (state, action) => {
    const places = action
      .payload
      .raw
      .tips
      .filter(tip => tip.address)
      .filter(tip => tip.address.length)
      .filter(tip => tip.location)
      .filter(tip => tip.location.length);

    return uniq(places);
  },
}, null);
