import React from 'react';
import PropTypes from 'prop-types';
import QrCodeScanner from './QrCodeScanner';
import Input from 'antd/es/input';
import Icon from 'antd/es/icon';


export default class TextType extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
  }

  state = {
    scanning: false,
  }

  handleQrCodeRecoganised = (text) => {
    this.closeScanner();
    this.props.onChange(text);
  }

  openScanner = () => {
    this.setState(state => ({
      ...state,
      scanning: true,
    }));
  }

  closeScanner = () => {
    this.setState(state => ({
      ...state,
      scanning: false,
    }));
  }

  render() {
    const { onChange, ...rest } = this.props;

    return (
      <Input.Group>
        <Input
          {...rest}
          onChange={evt => onChange(evt.target.value)}
          addonAfter={
            <Icon type="qrcode" onClick={this.openScanner} />
          }
        />

        {this.state.scanning ? (
          <QrCodeScanner
            onChange={value => this.handleQrCodeRecoganised(value)}
            onClose={this.closeScanner}
          />
        ) : null}
      </Input.Group>
    );
  }
}
