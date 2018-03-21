import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form';
import WizardFormFirstPage from './WizardFormFirstPage';
import WizardFormSecondPage from './WizardFormSecondPage';

class InvoiceCreate extends Component {
  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.state = {
      page: 1
    }
  }
  nextPage() {
    this.setState({page: this.state.page + 1})
  }

  previousPage() {
    this.setState({page: this.state.page - 1})
  }

  render() {

    const {
      handleSubmit,
      createInvoice,
      orders,
      selectOrders,
      selectedRowKeys,
      totalAmount,
      computeTotalAmount,
    } = this.props;

    const {page} = this.state
    return (
      <div>
        {page === 1 &&
          <WizardFormFirstPage
            orders={orders}
            selectOrders={selectOrders}
            selectedRowKeys={selectedRowKeys}
            totalAmount={totalAmount}
            computeTotalAmount={computeTotalAmount}
            onSubmit={handleSubmit(this.nextPage)}
          />}
        {page === 2 &&
          <WizardFormSecondPage
            previousPage={this.previousPage}
            onSubmit={handleSubmit(createInvoice)}
          />}
      </div>
    )
  }
}

InvoiceCreate.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  createInvoice: PropTypes.func.isRequired,
}

export default reduxForm({
  initialValues: {
    orders: [],
  },
  form: 'invoice-create', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(InvoiceCreate)
