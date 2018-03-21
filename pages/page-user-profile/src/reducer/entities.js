import { handleActions } from 'redux-actions';
import * as constants from '../constants';


const DEFAULT_STATE = {
  orders: {},
  user: {},
  invoices: {}
};


export default handleActions({
  [constants.PROFILE_FETCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities,
  }),
  [constants.ORDERS_SEARCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities,
  }),
  [constants.INVOICES_SEARCH_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload.entities,
  }),
}, DEFAULT_STATE);
