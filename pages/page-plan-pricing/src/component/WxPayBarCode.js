import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/es/modal';
import QRCode from 'qrcode.react';


export default class PagePlanPricing extends Component {

  static propTypes = {
    wxpayInfo: PropTypes.object.isRequired,
  }


  render() {
    const {
      wxpayInfo,
    } = this.props;


    return (
      <Modal
        title="微信支付二维码"
        visible={true}
      >
        <p>请使用微信扫描二维码支付</p>
        <QRCode value={wxpayInfo.code_url} />
      </Modal>
    );
  }
}
