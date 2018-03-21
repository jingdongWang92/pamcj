import { handleActions } from 'redux-actions';
import * as constants from '../constants';
import union from 'lodash/fp/union';
import { denormalize } from 'normalizr';
import * as schemas from '../schemas';


export default handleActions({
  [constants.ORGANIZATIONS_SEARCH_SUCCESS]: (state, action) => union(state, action.payload.result),
  [constants.CARTOGRAM_FETCH_SUCCESS]: (state, action) => {
    const cartogram = denormalize(action.payload.result, schemas.cartogram, action.payload.entities);
    return union(state, [cartogram.owner_id]);
  },
}, []);
