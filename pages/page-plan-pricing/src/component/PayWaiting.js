import React, { Component } from 'react';
import Modal from 'antd/es/modal';


export default class PayWaiting extends Component {

  render() {
    return (
      <Modal
        title="等待支付结果"
        visible={true}
      >
        <p>稍后，正在等待支付结果</p>
      </Modal>
    );
  }
}
