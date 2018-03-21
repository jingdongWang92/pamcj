import React, { Component } from 'react';
import ColorPicker from '@jcmap/component-color-picker';
import Form from 'antd/es/form';


export default class StrokeColorEditor extends Component {

  render() {
    const { enabled, value, onChange } = this.props;

    return enabled && (
      <Form.Item label="笔画颜色">
        <ColorPicker value={value} onChange={onChange} />
      </Form.Item>
    );
  }
}
