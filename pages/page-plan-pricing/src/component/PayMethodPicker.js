import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/es/modal';


export default class PayMethodPicker extends Component {

  static propTypes = {
    selectPayMethod: PropTypes.func.isRequired,
    unselectPayMethod: PropTypes.func.isRequired,
    checkoutWithAlipay: PropTypes.func.isRequired,
    checkoutWithWxpay: PropTypes.func.isRequired,
    selectedOrganization: PropTypes.object.isRequired,
    selectedPlan: PropTypes.object.isRequired,
    selectedPayMethod: PropTypes.string,
    order: PropTypes.object,
  }


  render() {
    const {
      selectedPlan,
      selectedOrganization,
      selectedPayMethod,
      selectPayMethod,
      unselectPayMethod,
      order,
      checkoutWithAlipay,
      checkoutWithWxpay,
    } = this.props;


    return (
      <Modal
        title="选择支付方式"
        visible={true}
        onOk={() => {
          if (selectedPayMethod === 'alipay') {
            checkoutWithAlipay(order);
          } else if (selectedPayMethod === 'wxpay') {
            checkoutWithWxpay(order);
          }
        }}
        onCancel={() => unselectPayMethod()}
      >
        <ul>
          <li>Plan: {selectedPlan.name}</li>
          <li>Price: ￥{selectedPlan.price}</li>
          <li>Buyer: {selectedOrganization.name}</li>
          <li>Pay with:
            <input
              type="radio"
              name="pay_with"
              value="alipay"
              checked={selectedPayMethod === 'alipay'}
              onChange={() => selectPayMethod('alipay')}
            />支付宝
            <input
              type="radio"
              name="pay_with"
              value="wxpay"
              checked={selectedPayMethod === 'wxpay'}
              onChange={() => selectPayMethod('wxpay')}
            />微信
          </li>
        </ul>
      </Modal>
    );
  }
}
