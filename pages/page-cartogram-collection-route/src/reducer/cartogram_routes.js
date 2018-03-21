import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.CARTOGRAM_ROUTES_SEARCH_SUCCESS]: (state, action) => action.payload.result,
  [constants.CARTOGRAM_ROUTE_CREATE_SUCCESS]: (state, action) => [...state, action.payload.result],
  [constants.CARTOGRAM_ROUTE_REMOVE_SUCCESS]: (state, action) => {
    const willRemoveCartogramRouteId = action.payload.id;
    return state.filter(cartogramRouteId => cartogramRouteId !== willRemoveCartogramRouteId);
  },
}, []);
