import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import Component from './component';
import * as schemas from './schemas';
import { denormalize } from 'normalizr';


function mapStateToProps(state) {
  const { orders, invoices,visible, entities, selectedRowKeys, totalAmount } = state;
  const user = denormalize(state.user, schemas.user, entities);
  return {
    user,
    orders: orders.map(orderId => entities.orders[orderId]),
    invoices: invoices.map(invoiceId => entities.invoices[invoiceId]),
    selectedRowKeys,
    totalAmount,
    visible,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}



export default connect(mapStateToProps, mapDispatchToProps)(Component);
