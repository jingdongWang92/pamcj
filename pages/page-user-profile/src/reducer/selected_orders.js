import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.ORDERS_SELECT]: (state, action) => action.payload,
}, []);
