import React, { Component } from 'react';
import Modal from 'antd/es/modal';


export default class PaySuccess extends Component {
  render() {
    return (
      <Modal
        title="支付成功"
        visible={true}
      >
        <p>支付成功</p>
      </Modal>
    );
  }
}
