import { combineReducers } from 'redux';
import entities from './entities';
import user from './user';
import orders from './orders';
import invoices from './invoices';
import selectedRowKeys from './selected_orders';
import totalAmount from './total_amount';
import visible from './visible';
import { reducer as form } from 'redux-form';


export default combineReducers({
  entities,
  user,
  orders,
  invoices,
  form,
  selectedRowKeys,
  totalAmount,
  visible,
});
